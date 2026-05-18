"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createClient } from "@/lib/supabase/client";
import { PORTFOLIO_CATEGORIES, formatPortfolioCategory, type PortfolioItem } from "@/types/pro-profile";

type PortfolioManagerProps = {
  proId: string;
  initialItems: PortfolioItem[];
};

function SortableItem({
  item,
  selected,
  onSelect,
  onDelete,
}: {
  item: PortfolioItem;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
  };
  const src = item.thumb_url || item.image_url;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`relative overflow-hidden rounded-brand-md border ${selected ? "border-teal" : "border-gold/15"} bg-navy-deep`}
    >
      <button
        type="button"
        className="absolute left-2 top-2 z-10 rounded bg-navy/80 px-2 py-0.5 text-xs text-cream"
        onClick={onSelect}
        aria-pressed={selected}
      >
        {selected ? "Selected" : "Select"}
      </button>
      <button
        type="button"
        className="absolute right-2 top-2 z-10 cursor-grab rounded bg-navy/80 px-2 py-0.5 text-xs text-gold active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        Drag
      </button>
      <div className="relative aspect-[3/4] w-full">
        <Image src={src} alt={item.alt_text} fill className="object-cover" sizes="200px" />
      </div>
      <div className="p-2">
        <p className="font-body text-xs text-gold-body">{formatPortfolioCategory(item.category)}</p>
        <button
          type="button"
          onClick={onDelete}
          className="mt-1 font-body text-xs text-red-300 hover:underline"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export function PortfolioManager({ proId, initialItems }: PortfolioManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkCategory, setBulkCategory] = useState<string>(PORTFOLIO_CATEGORIES[0]);
  const [message, setMessage] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const persistOrder = useCallback(async (ordered: PortfolioItem[]) => {
    const supabase = createClient();
    await Promise.all(
      ordered.map((item, index) =>
        supabase.from("portfolio_items").update({ display_order: index }).eq("id", item.id),
      ),
    );
  }, []);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    await persistOrder(next);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const alt = prompt("Alt text (required for accessibility):")?.trim();
    if (!alt) {
      setMessage("Alt text is required for every portfolio image.");
      return;
    }
    const category = prompt(`Category (${PORTFOLIO_CATEGORIES.join(", ")}):`, "color") ?? "other";
    const caption = prompt("Caption (optional):") ?? null;

    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${proId}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("portfolio-images").upload(path, file);
    if (uploadError) {
      setMessage("Upload failed.");
      return;
    }
    const { data: urlData } = supabase.storage.from("portfolio-images").getPublicUrl(path);

    const { data, error } = await supabase
      .from("portfolio_items")
      .insert({
        pro_id: proId,
        category,
        image_url: urlData.publicUrl,
        thumb_url: urlData.publicUrl,
        alt_text: alt,
        caption,
        display_order: items.length,
      })
      .select()
      .single();

    if (error || !data) {
      setMessage("Could not save portfolio item.");
      return;
    }
    setItems((prev) => [...prev, data as PortfolioItem]);
    setMessage("Photo added.");
    e.target.value = "";
  }

  async function deleteItem(id: string) {
    const supabase = createClient();
    await supabase.from("portfolio_items").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelected((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  }

  async function bulkCategorize() {
    if (selected.size === 0) return;
    const supabase = createClient();
    await supabase.from("portfolio_items").update({ category: bulkCategory }).in("id", [...selected]);
    setItems((prev) =>
      prev.map((i) => (selected.has(i.id) ? { ...i, category: bulkCategory } : i)),
    );
    setMessage(`Updated ${selected.size} items.`);
    setSelected(new Set());
  }

  return (
    <div>
      <h2 className="font-heading text-xl text-gold">Portfolio</h2>
      <p className="mt-1 font-body text-sm text-gold-body">
        Drag to reorder. Alt text is required on every image.
      </p>

      <label className="mt-6 block font-body text-sm text-cream">
        Add photo
        <input type="file" accept="image/*" className="mt-1 block w-full text-sm" onChange={handleUpload} />
      </label>

      {selected.size > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select
            value={bulkCategory}
            onChange={(e) => setBulkCategory(e.target.value)}
            className="rounded-brand-md border border-gold/20 bg-navy-deep px-2 py-1 text-sm text-cream"
            aria-label="Bulk category"
          >
            {PORTFOLIO_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {formatPortfolioCategory(c)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={bulkCategorize}
            className="rounded-full border border-gold/30 px-3 py-1 text-sm text-gold"
          >
            Set category on {selected.size} selected
          </button>
        </div>
      ) : null}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
          <ul className="mt-6 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                selected={selected.has(item.id)}
                onSelect={() =>
                  setSelected((s) => {
                    const n = new Set(s);
                    if (n.has(item.id)) n.delete(item.id);
                    else n.add(item.id);
                    return n;
                  })
                }
                onDelete={() => deleteItem(item.id)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {message ? <p className="mt-4 font-body text-sm text-teal">{message}</p> : null}
    </div>
  );
}
