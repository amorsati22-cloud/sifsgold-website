import type { ModuleType, ProgramType } from "@/types/school";

export type SyllabusTemplateModule = {
  name: string;
  description: string;
  required_hours: number;
  module_type: ModuleType;
  module_order: number;
};

/** Texas cosmetology 1500-hour sample breakdown */
export function getSyllabusTemplate(
  state: string,
  programType: ProgramType,
  requiredHours: number,
): SyllabusTemplateModule[] {
  const st = state.toUpperCase();
  if (st === "TX" && programType === "cosmetology" && requiredHours >= 1500) {
    return [
      { module_order: 1, name: "Orientation & Rules", description: "School policies, state law intro", required_hours: 40, module_type: "theory" },
      { module_order: 2, name: "Sanitation & Bacteriology", description: "Disinfection, safety", required_hours: 120, module_type: "theory" },
      { module_order: 3, name: "Hair Cutting", description: "Foundations through advanced", required_hours: 280, module_type: "practical" },
      { module_order: 4, name: "Hair Styling", description: "Wet/dry styling, thermal", required_hours: 240, module_type: "practical" },
      { module_order: 5, name: "Chemical Services", description: "Color, relaxers, texture", required_hours: 320, module_type: "lab" },
      { module_order: 6, name: "Nails & Skin Intro", description: "Manicure, facials basics", required_hours: 180, module_type: "lab" },
      { module_order: 7, name: "Salon Clinic Floor", description: "Live services under supervision", required_hours: 520, module_type: "clinic" },
    ];
  }

  const chunk = Math.floor(requiredHours / 5);
  return [
    { module_order: 1, name: "Theory foundations", description: "Core academics", required_hours: chunk, module_type: "theory" },
    { module_order: 2, name: "Practical skills I", description: "Hands-on fundamentals", required_hours: chunk, module_type: "practical" },
    { module_order: 3, name: "Practical skills II", description: "Advanced techniques", required_hours: chunk, module_type: "practical" },
    { module_order: 4, name: "Lab applications", description: "Supervised practice", required_hours: chunk, module_type: "lab" },
    { module_order: 5, name: "Clinic floor", description: "Client services", required_hours: requiredHours - chunk * 4, module_type: "clinic" },
  ];
}
