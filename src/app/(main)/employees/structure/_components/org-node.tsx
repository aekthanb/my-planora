"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrgMember } from "../types";

type OrgNodeProps = {
  node: OrgMember;
  collapsedIds: Set<string>;
  onToggle: (id: string) => void;
  matchIds: Set<string> | null;
  activeSearch: boolean;
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function OrgNode({ node, collapsedIds, onToggle, matchIds, activeSearch }: OrgNodeProps) {
  const children = node.children ?? [];
  const hasChildren = children.length > 0;
  const collapsed = !activeSearch && collapsedIds.has(node.id);
  const isMatch = matchIds?.has(node.id) ?? false;

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "bg-card relative flex w-56 items-start gap-3 rounded-xl border p-3 shadow-sm",
          isMatch && "ring-foreground ring-offset-background ring-2 ring-offset-2",
        )}
      >
        <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
          {initials(node.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{node.name}</p>
          <p className="text-muted-foreground truncate text-xs">{node.position}</p>
          <span className="bg-muted text-muted-foreground mt-1.5 inline-flex max-w-full items-center truncate rounded-full px-2 py-0.5 text-[0.65rem]">
            {node.department}
          </span>
        </div>

        {hasChildren && (
          <button
            type="button"
            onClick={() => onToggle(node.id)}
            aria-label={collapsed ? `ขยาย ${node.name}` : `ย่อ ${node.name}`}
            aria-expanded={!collapsed}
            className="bg-background text-muted-foreground hover:text-foreground hover:bg-muted absolute -bottom-3 left-1/2 flex size-6 -translate-x-1/2 items-center justify-center rounded-full border shadow-sm transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </button>
        )}
      </div>

      {hasChildren && !collapsed && (
        <>
          <div className="bg-border h-6 w-px" />
          <div className="flex items-start">
            {children.map((child, index) => (
              <div key={child.id} className="flex flex-col items-center px-4">
                <div className="relative h-6 w-full">
                  {children.length > 1 && (
                    <div
                      className={cn(
                        "bg-border absolute top-0 h-px",
                        index === 0 && "right-0 left-1/2",
                        index === children.length - 1 && "right-1/2 left-0",
                        index > 0 && index < children.length - 1 && "inset-x-0",
                      )}
                    />
                  )}
                  <div className="bg-border absolute top-0 left-1/2 h-6 w-px -translate-x-1/2" />
                </div>
                <OrgNode
                  node={child}
                  collapsedIds={collapsedIds}
                  onToggle={onToggle}
                  matchIds={matchIds}
                  activeSearch={activeSearch}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
