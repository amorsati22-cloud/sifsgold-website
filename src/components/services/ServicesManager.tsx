"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getCategoryLabel } from "@/lib/services/categories";
import { formatDuration, formatServicePrice } from "@/lib/services/format";
import { SERVICE_TEMPLATES } from "@/lib/services/templates";
import type { ServiceCategoryRow, ServiceWithAddons } from "@/types/services";

type ServicesManagerProps = {
  proId: string;
  initialServices: ServiceWithAddons[];
  categories: ServiceCategoryRow[];
};

function SortableRow({
  service,
  categories,
  selected,
  onSelect,
  onDelete,
}: {
  service: ServiceWithAddons;
  categories: ServiceCategoryRow[];
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: service.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-gold/10">
      <td className="px-2 py-3">
        <input type="checkbox" checked={selected} onChange={onSelect} aria-label={`Select ${service.name}`} />
      </td>
      <td className="px-2 py-3">
        <button
          type="button"
          className="cursor-grab font-body text-xs text-gold active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          Drag
        </button>
      </td>
      <td className="px-3 py-3 font-body text-sm text-cream">{service.name}</td>
      <td className="hidden px-3 py-3 font-body text-xs text-gold-body sm:table-cell">
        {getCategoryLabel(categories, service.category)}
      </td>
      <td className="hidden px-3 py-3 font-body text-xs text-cream/70 md:table-cell">
        {formatDuration(service.duration_minutes)}
      </td>
      <td className="px-3 py-3 font-body text-sm text-gold">{formatServicePrice(service)}</td>
      <td className="px-3 py-3">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
            service.visible ? "bg-teal/20 text-teal" : "bg-cream/10 text-cream/50"
          }`}
        >
          {service.visible ? "Live" : "Draft"}
        </span>
      </td>
      <td className="px-3 py-3 text-right">
        <Link
          href={`/dashboard/services/${service.id}`}
          className="mr-2 inline-flex text-gold hover:text-gold-light"
          aria-label={`Edit ${service.name}`}
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex text-red-300 hover:text-red-200"
          aria-label={`Delete ${service.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

export function ServicesManager({ proId, initialServices, categories }: ServicesManagerProps) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const persistOrder = useCallback(
    async (ordered: ServiceWithAddons[]) => {
      const supabase = createClient();
      await Promise.all(
        ordered.map((s, i) =>
          supabase.from("services").update({ display_order: i }).eq("id", s.id),
        ),
      );
    },
    [],
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = services.findIndex((s) => s.id === active.id);
    const newIndex = services.findIndex((s) => s.id === over.id);
    const next = arrayMove(services, oldIndex, newIndex);
    setServices(next);
    await persistOrder(next);
  }

  async function deleteService(id: string) {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    const supabase = createClient();
    await supabase.from("services").delete().eq("id", id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    setMessage("Service deleted.");
  }

  async function bulkSetVisible(visible: boolean) {
    if (selected.size === 0) return;
    const supabase = createClient();
    await supabase.from("services").update({ visible }).in("id", [...selected]);
    setServices((prev) => prev.map((s) => (selected.has(s.id) ? { ...s, visible } : s)));
    setMessage(visible ? "Services published." : "Services hidden.");
    setSelected(new Set());
  }

  async function copyFromTemplate(index: number) {
    const template = SERVICE_TEMPLATES[index];
    if (!template) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from("services")
      .insert({
        pro_id: proId,
        ...template,
        visible: false,
        bookable_online: true,
        display_order: services.length,
      })
      .select("id")
      .single();
    if (error || !data) {
      setMessage("Could not copy template.");
      return;
    }
    router.push(`/dashboard/services/${data.id}`);
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-gold">Services menu</h1>
          <p className="mt-1 font-body text-sm text-gold-body">
            Drag to reorder. Drafts stay hidden until you publish.
          </p>
        </div>
        <Link
          href="/dashboard/services/new"
          className="rounded-full bg-gold px-5 py-2.5 font-body text-sm font-semibold text-navy hover:bg-gold-light"
        >
          + Add service
        </Link>
      </div>

      {selected.size > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => bulkSetVisible(true)}
            className="rounded-full border border-gold/30 px-3 py-1 text-sm text-gold"
          >
            Show selected ({selected.size})
          </button>
          <button
            type="button"
            onClick={() => bulkSetVisible(false)}
            className="rounded-full border border-gold/30 px-3 py-1 text-sm text-cream"
          >
            Hide selected
          </button>
        </div>
      ) : null}

      <details className="mt-4 rounded-brand-md border border-gold/10 p-3">
        <summary className="cursor-pointer font-body text-sm text-gold">Copy from template</summary>
        <ul className="mt-2 list-none space-y-1 p-0">
          {SERVICE_TEMPLATES.map((t, i) => (
            <li key={t.name}>
              <button
                type="button"
                onClick={() => copyFromTemplate(i)}
                className="font-body text-sm text-cream/80 hover:text-gold"
              >
                {t.name} — ${t.price_amount}
                {t.price_type === "starting_at" ? "+" : ""}
              </button>
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-6 overflow-x-auto rounded-brand-lg border border-gold/10">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-navy-deep/80 font-body text-xs uppercase tracking-wide text-gold-body">
              <tr>
                <th className="px-2 py-2" scope="col">
                  <span className="sr-only">Select</span>
                </th>
                <th className="px-2 py-2" scope="col">
                  Order
                </th>
                <th className="px-3 py-2" scope="col">
                  Name
                </th>
                <th className="hidden px-3 py-2 sm:table-cell" scope="col">
                  Category
                </th>
                <th className="hidden px-3 py-2 md:table-cell" scope="col">
                  Duration
                </th>
                <th className="px-3 py-2" scope="col">
                  Price
                </th>
                <th className="px-3 py-2" scope="col">
                  Status
                </th>
                <th className="px-3 py-2 text-right" scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <SortableContext items={services.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <tbody>
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center font-body text-sm text-cream/60">
                      No services yet. Add your first service or copy from a template.
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <SortableRow
                      key={service.id}
                      service={service}
                      categories={categories}
                      selected={selected.has(service.id)}
                      onSelect={() =>
                        setSelected((s) => {
                          const n = new Set(s);
                          if (n.has(service.id)) n.delete(service.id);
                          else n.add(service.id);
                          return n;
                        })
                      }
                      onDelete={() => deleteService(service.id)}
                    />
                  ))
                )}
              </tbody>
            </SortableContext>
          </table>
        </DndContext>
      </div>

      {message ? <p className="mt-4 font-body text-sm text-teal">{message}</p> : null}
    </div>
  );
}
