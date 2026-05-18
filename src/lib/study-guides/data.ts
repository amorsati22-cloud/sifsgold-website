import "server-only";

import { createClient } from "@/lib/supabase/server";
import { DECK_UNLOCK_THRESHOLD } from "@/lib/study-guides/constants";
import type {
  DeckWithProgress,
  Flashcard,
  FlashcardDeck,
  StudyAnalytics,
  StudyGuide,
  StudyGuideWithProgress,
  StudySession,
  UserCardProgress,
  UserStudyStreak,
} from "@/types/study-guides";

export async function getStudyUser() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function listStudyGuides(filters?: {
  program?: string | null;
  state?: string | null;
}): Promise<StudyGuide[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  let query = supabase
    .from("study_guides")
    .select("*")
    .eq("public", true)
    .order("order_index", { ascending: true });

  if (filters?.program) query = query.eq("program_type", filters.program);
  if (filters?.state) query = query.eq("state", filters.state);

  const { data, error } = await query;
  if (error || !data) return [];
  return data as StudyGuide[];
}

async function fetchProgressMap(
  userId: string,
  cardIds: string[],
): Promise<Map<string, UserCardProgress>> {
  const map = new Map<string, UserCardProgress>();
  if (cardIds.length === 0) return map;

  const supabase = await createClient();
  if (!supabase) return map;

  const { data } = await supabase
    .from("user_card_progress")
    .select("*")
    .eq("user_id", userId)
    .in("card_id", cardIds);

  for (const row of (data ?? []) as UserCardProgress[]) {
    map.set(row.card_id, row);
  }
  return map;
}

function progressPercent(mastered: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((mastered / total) * 100);
}

export async function listStudyGuidesWithProgress(
  userId: string | null,
  filters?: { program?: string | null; state?: string | null },
): Promise<StudyGuideWithProgress[]> {
  const guides = await listStudyGuides(filters);
  if (!userId) {
    return guides.map((g) => ({ ...g, progressPercent: 0, masteredCount: 0 }));
  }

  const supabase = await createClient();
  if (!supabase) {
    return guides.map((g) => ({ ...g, progressPercent: 0, masteredCount: 0 }));
  }

  const { data: decks } = await supabase
    .from("flashcard_decks")
    .select("id, study_guide_id");
  const { data: cards } = await supabase.from("flashcards").select("id, deck_id");
  const { data: progressRows } = await supabase
    .from("user_card_progress")
    .select("card_id, mastery_level")
    .eq("user_id", userId)
    .eq("mastery_level", "mastered");

  const deckToGuide = new Map(
    (decks ?? []).map((d) => [d.id as string, d.study_guide_id as string]),
  );
  const cardToDeck = new Map(
    (cards ?? []).map((c) => [c.id as string, c.deck_id as string]),
  );

  const masteredByGuide = new Map<string, number>();
  for (const row of progressRows ?? []) {
    const deckId = cardToDeck.get(row.card_id as string);
    const guideId = deckId ? deckToGuide.get(deckId) : undefined;
    if (guideId) masteredByGuide.set(guideId, (masteredByGuide.get(guideId) ?? 0) + 1);
  }

  return guides.map((g) => {
    const masteredCount = masteredByGuide.get(g.id) ?? 0;
    return {
      ...g,
      masteredCount,
      progressPercent: progressPercent(masteredCount, g.total_cards),
    };
  });
}

export async function getStudyGuide(guideId: string): Promise<StudyGuide | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("study_guides")
    .select("*")
    .eq("id", guideId)
    .eq("public", true)
    .maybeSingle();
  return (data as StudyGuide) ?? null;
}

export async function getGuideDecksWithProgress(
  guideId: string,
  userId: string | null,
): Promise<DeckWithProgress[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data: decks } = await supabase
    .from("flashcard_decks")
    .select("*")
    .eq("study_guide_id", guideId)
    .order("order_index", { ascending: true });

  if (!decks?.length) return [];

  const deckList = decks as FlashcardDeck[];
  const deckIds = deckList.map((d) => d.id);

  const { data: cards } = await supabase
    .from("flashcards")
    .select("id, deck_id")
    .in("deck_id", deckIds);

  const cardIds = (cards ?? []).map((c) => c.id as string);
  const progressMap = userId ? await fetchProgressMap(userId, cardIds) : new Map();

  const now = new Date();
  let lastDeckPct = 1;

  return deckList.map((deck) => {
    const deckCardIds = (cards ?? [])
      .filter((c) => c.deck_id === deck.id)
      .map((c) => c.id as string);
    let mastered = 0;
    let due = 0;
    for (const cid of deckCardIds) {
      const p = progressMap.get(cid);
      if (p?.mastery_level === "mastered") mastered += 1;
      if (!p || !p.next_due_at || new Date(p.next_due_at) <= now) due += 1;
    }
    const pct = deck.card_count > 0 ? mastered / deck.card_count : 0;
    const locked = deck.order_index > 1 && lastDeckPct < DECK_UNLOCK_THRESHOLD;
    lastDeckPct = pct;

    return {
      ...deck,
      masteredCount: mastered,
      progressPercent: progressPercent(mastered, deck.card_count),
      dueCount: due,
      locked,
    };
  });
}

export async function getDeck(deckId: string): Promise<FlashcardDeck | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("flashcard_decks")
    .select("*")
    .eq("id", deckId)
    .maybeSingle();
  return (data as FlashcardDeck) ?? null;
}

export async function getDeckWithGuide(deckId: string) {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("flashcard_decks")
    .select("*, study_guides(*)")
    .eq("id", deckId)
    .maybeSingle();
  return data as (FlashcardDeck & { study_guides: StudyGuide }) | null;
}

export async function getDeckCards(deckId: string): Promise<Flashcard[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("flashcards")
    .select("*")
    .eq("deck_id", deckId)
    .order("order_index", { ascending: true });
  return (data as Flashcard[]) ?? [];
}

export async function getSessionCards(
  deckId: string,
  userId: string,
  limit = 20,
): Promise<Flashcard[]> {
  const cards = await getDeckCards(deckId);
  const progressMap = await fetchProgressMap(
    userId,
    cards.map((c) => c.id),
  );
  const now = new Date();

  const due = cards.filter((c) => {
    const p = progressMap.get(c.id);
    return !p?.next_due_at || new Date(p.next_due_at) <= now;
  });
  const rest = cards.filter((c) => !due.includes(c));
  const ordered = [...due, ...rest];
  return ordered.slice(0, limit);
}

export async function getRecentSessions(
  deckId: string,
  userId: string,
  take = 5,
): Promise<StudySession[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("deck_id", deckId)
    .eq("user_id", userId)
    .not("ended_at", "is", null)
    .order("started_at", { ascending: false })
    .limit(take);
  return (data as StudySession[]) ?? [];
}

export async function getStudyStreak(userId: string): Promise<UserStudyStreak | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("user_study_streaks")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return (data as UserStudyStreak) ?? null;
}

export async function getDueTodayCount(userId: string): Promise<number> {
  const supabase = await createClient();
  if (!supabase) return 0;

  const { data: decks } = await supabase
    .from("flashcard_decks")
    .select("id, study_guides!inner(public)")
    .eq("study_guides.public", true);
  const deckIds = (decks ?? []).map((d) => d.id as string);
  if (deckIds.length === 0) return 0;

  const { data: cards } = await supabase
    .from("flashcards")
    .select("id")
    .in("deck_id", deckIds);

  const cardIds = (cards ?? []).map((c) => c.id as string);
  if (cardIds.length === 0) return 0;

  const progressMap = await fetchProgressMap(userId, cardIds);
  const now = new Date();
  let due = 0;
  for (const id of cardIds) {
    const p = progressMap.get(id);
    if (!p || !p.next_due_at || new Date(p.next_due_at) <= now) due += 1;
  }
  return due;
}

export async function getStudyAnalytics(userId: string): Promise<StudyAnalytics> {
  const supabase = await createClient();
  const streak = await getStudyStreak(userId);
  const dueTodayCount = await getDueTodayCount(userId);

  if (!supabase) {
    return { streak, dueTodayCount, masteryByDeck: [] };
  }

  const { data: decks } = await supabase.from("flashcard_decks").select("id, name, card_count");
  const { data: cards } = await supabase.from("flashcards").select("id, deck_id");
  const { data: progress } = await supabase
    .from("user_card_progress")
    .select("card_id, mastery_level")
    .eq("user_id", userId)
    .eq("mastery_level", "mastered");

  const cardToDeck = new Map(
    (cards ?? []).map((c) => [c.id as string, c.deck_id as string]),
  );
  const masteredByDeck = new Map<string, number>();
  for (const row of progress ?? []) {
    const deckId = cardToDeck.get(row.card_id as string);
    if (deckId) masteredByDeck.set(deckId, (masteredByDeck.get(deckId) ?? 0) + 1);
  }

  const masteryByDeck = (decks ?? []).map((d) => ({
    name: d.name as string,
    mastered: masteredByDeck.get(d.id as string) ?? 0,
    total: d.card_count as number,
  }));

  return { streak, dueTodayCount, masteryByDeck };
}
