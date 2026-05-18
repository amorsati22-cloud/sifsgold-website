import "server-only";

import { createClient } from "@/lib/supabase/server";
import { PRO_USER_TYPES } from "@/lib/auth-pro";
import type { ContactOption } from "@/types/messaging";

export async function getMessagingContacts(userId: string, userType: string | null): Promise<ContactOption[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const isPro = userType && PRO_USER_TYPES.includes(userType as (typeof PRO_USER_TYPES)[number]);
  const contacts: ContactOption[] = [];
  const seen = new Set<string>();

  if (isPro) {
    const { data: appts } = await supabase
      .from("appointments")
      .select("client_id, guest_name, guest_email")
      .eq("pro_id", userId)
      .order("scheduled_start", { ascending: false })
      .limit(100);

    for (const a of appts ?? []) {
      if (a.client_id && !seen.has(a.client_id as string)) {
        seen.add(a.client_id as string);
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", a.client_id)
          .maybeSingle();
        if (profile) {
          contacts.push({
            user_id: a.client_id as string,
            display_name: (a.guest_name as string) ?? "Client",
            subtitle: a.guest_email as string | null,
            avatar_url: null,
          });
        }
      }
    }

    const { data: notes } = await supabase
      .from("pro_client_notes")
      .select("client_id, guest_name, guest_email, guest_key")
      .eq("pro_id", userId);

    for (const n of notes ?? []) {
      if (n.client_id && !seen.has(n.client_id as string)) {
        seen.add(n.client_id as string);
        contacts.push({
          user_id: n.client_id as string,
          display_name: (n.guest_name as string) ?? "Client",
          subtitle: n.guest_email as string | null,
          avatar_url: null,
        });
      }
    }
  } else {
    const { data: appts } = await supabase
      .from("appointments")
      .select("pro_id, pro_profiles(display_name, username, avatar_url)")
      .eq("client_id", userId)
      .order("scheduled_start", { ascending: false })
      .limit(50);

    for (const a of appts ?? []) {
      const proId = a.pro_id as string;
      if (seen.has(proId)) continue;
      seen.add(proId);
      const pro = a.pro_profiles as {
        display_name: string;
        username: string;
        avatar_url: string | null;
      } | null;
      contacts.push({
        user_id: proId,
        display_name: pro?.display_name ?? "Professional",
        subtitle: pro?.username ? `@${pro.username}` : null,
        avatar_url: pro?.avatar_url ?? null,
      });
    }

    const { data: favorites } = await supabase
      .from("client_favorites")
      .select("pro_id, pro_profiles(display_name, username, avatar_url)")
      .eq("client_id", userId);

    for (const f of favorites ?? []) {
      const proId = f.pro_id as string;
      if (seen.has(proId)) continue;
      seen.add(proId);
      const pro = f.pro_profiles as {
        display_name: string;
        username: string;
        avatar_url: string | null;
      } | null;
      contacts.push({
        user_id: proId,
        display_name: pro?.display_name ?? "Professional",
        subtitle: pro?.username ? `@${pro.username}` : null,
        avatar_url: pro?.avatar_url ?? null,
      });
    }
  }

  return contacts.sort((a, b) => a.display_name.localeCompare(b.display_name));
}
