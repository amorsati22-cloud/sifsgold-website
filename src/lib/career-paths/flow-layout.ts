import { hierarchy, tree } from "d3-hierarchy";
import type { Edge, Node } from "reactflow";
import type { CareerMilestone, CareerRole } from "@/types/career-paths";

export type MilestoneNodeData = {
  kind: "milestone" | "role";
  label: string;
  description: string;
  months?: number;
  cost?: number;
  requirements?: string[];
  outcomes?: string[];
  medianSalary?: number;
  salaryRange?: string;
  blsLink?: string;
  salaryYear?: number;
  roleId?: string;
};

export function buildCareerFlowGraph(
  milestones: CareerMilestone[],
  rolesByOrder: Map<number, CareerRole>,
): { nodes: Node<MilestoneNodeData>[]; edges: Edge[] } {
  const sorted = [...milestones].sort((a, b) => a.milestone_order - b.milestone_order);

  type TreeDatum = { id: string; children?: TreeDatum[]; data: MilestoneNodeData };
  const chain: TreeDatum[] = sorted.map((ms) => {
    const role = rolesByOrder.get(ms.milestone_order);
    const children: TreeDatum[] = [];
    if (role) {
      children.push({
        id: `role-${role.id}`,
        data: {
          kind: "role",
          label: role.name,
          description: role.description,
          medianSalary: role.median_annual_salary,
          salaryRange: `$${role.salary_range_low.toLocaleString()}–$${role.salary_range_high.toLocaleString()}`,
          blsLink: role.bls_source_link,
          salaryYear: role.salary_data_year,
          roleId: role.id,
        },
      });
    }
    return {
      id: ms.id,
      data: {
        kind: "milestone",
        label: ms.name,
        description: ms.description,
        months: ms.estimated_duration_months,
        cost: ms.estimated_cost,
        requirements: ms.requirements,
        outcomes: ms.typical_outcomes,
      },
      children: children.length ? children : undefined,
    };
  });

  const root = hierarchy({ id: "root", data: { kind: "milestone", label: "", description: "" }, children: chain });
  const layout = tree<TreeDatum>().nodeSize([320, 140]);
  layout(root);

  const nodes: Node<MilestoneNodeData>[] = [];
  const edges: Edge[] = [];
  let prevId: string | null = null;

  root.descendants().forEach((d) => {
    if (d.data.id === "root") return;
    const id = d.data.id;
    nodes.push({
      id,
      type: "careerNode",
      position: { x: d.x, y: d.y },
      data: d.data.data,
    });
    if (prevId) {
      edges.push({ id: `e-${prevId}-${id}`, source: prevId, target: id, animated: true });
    }
    prevId = id;
  });

  return { nodes, edges };
}
