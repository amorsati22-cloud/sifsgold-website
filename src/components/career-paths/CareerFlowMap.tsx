"use client";

import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { CareerNode } from "@/components/career-paths/CareerNode";
import {
  buildCareerFlowGraph,
  type MilestoneNodeData,
} from "@/lib/career-paths/flow-layout";
import type { CareerMilestone, CareerRole } from "@/types/career-paths";

const nodeTypes = { careerNode: CareerNode };

function FlowInner({
  milestones,
  roles,
}: {
  milestones: CareerMilestone[];
  roles: (CareerRole & { milestone_order: number })[];
}) {
  const rolesByOrder = useMemo(() => {
    const m = new Map<number, CareerRole>();
    for (const r of roles) m.set(r.milestone_order, r);
    return m;
  }, [roles]);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildCareerFlowGraph(milestones, rolesByOrder),
    [milestones, roles, rolesByOrder],
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selected, setSelected] = useState<MilestoneNodeData | null>(null);

  const onNodeClick = useCallback((_: unknown, node: { data: MilestoneNodeData }) => {
    setSelected(node.data);
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="h-[min(70vh,640px)] rounded-brand-lg border border-gold/20 bg-navy-deep/40">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.4}
          maxZoom={1.2}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#D4A843" gap={24} size={1} />
          <Controls className="!border-gold/30 !bg-navy-deep" />
          <MiniMap
            className="!bg-navy-deep !border-gold/20"
            nodeColor={() => "#D4A843"}
          />
        </ReactFlow>
      </div>
      <aside className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-4 text-sm">
        <h2 className="font-heading text-gold">Node details</h2>
        {selected ? (
          <div className="mt-3 space-y-2 text-cream/85">
            <p className="font-medium text-cream">{selected.label}</p>
            <p>{selected.description}</p>
            {selected.requirements?.length ? (
              <ul className="list-disc pl-4 text-xs">
                {selected.requirements.map((r) => (
                  <li key={r}>{r.replace(/_/g, " ")}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-cream/60">Click a milestone or role node to expand details.</p>
        )}
      </aside>
    </div>
  );
}

export function CareerFlowMap(props: {
  milestones: CareerMilestone[];
  roles: (CareerRole & { milestone_order: number })[];
}) {
  return (
    <ReactFlowProvider>
      <FlowInner {...props} />
    </ReactFlowProvider>
  );
}
