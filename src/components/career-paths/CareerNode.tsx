"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import Link from "next/link";
import type { MilestoneNodeData } from "@/lib/career-paths/flow-layout";
import { BLS_DISCLAIMER, SALARY_ESTIMATE_NOTE } from "@/lib/career-paths/constants";

function CareerNodeComponent({ data }: NodeProps<MilestoneNodeData>) {
  const isRole = data.kind === "role";

  return (
    <div
      className={`max-w-xs rounded-brand-lg border px-4 py-3 shadow-lg ${
        isRole ? "border-gold/50 bg-navy-deep/95" : "border-gold/25 bg-navy-deep/80"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-gold" />
      <p className="text-xs font-semibold uppercase tracking-widest text-gold/80">
        {isRole ? "Role" : "Milestone"}
      </p>
      <p className="mt-1 font-heading text-sm text-gold">{data.label}</p>
      <p className="mt-2 line-clamp-3 text-xs text-cream/80">{data.description}</p>
      {!isRole && data.months != null ? (
        <p className="mt-2 text-xs text-goldBody">
          ~{data.months} mo · est. ${data.cost?.toLocaleString() ?? 0}
        </p>
      ) : null}
      {isRole && data.medianSalary != null ? (
        <div className="mt-2 border-t border-gold/15 pt-2">
          <p className="text-xs text-cream/60">{SALARY_ESTIMATE_NOTE}</p>
          <p className="font-heading text-lg text-cream">
            ${data.medianSalary.toLocaleString()}
            <span className="text-xs font-normal text-cream/60"> / yr</span>
          </p>
          {data.salaryRange ? (
            <p className="text-xs text-goldBody">Range: {data.salaryRange}</p>
          ) : null}
          {data.blsLink ? (
            <a
              href={data.blsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-xs text-gold hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              BLS OEWS {data.salaryYear} →
            </a>
          ) : null}
          <p className="mt-1 text-[10px] leading-snug text-cream/50">{BLS_DISCLAIMER}</p>
          {data.roleId ? (
            <Link
              href={`/career-paths/roles/${data.roleId}`}
              className="mt-2 inline-block text-xs font-semibold text-gold hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Role details →
            </Link>
          ) : null}
        </div>
      ) : null}
      <Handle type="source" position={Position.Bottom} className="!bg-gold" />
    </div>
  );
}

export const CareerNode = memo(CareerNodeComponent);
