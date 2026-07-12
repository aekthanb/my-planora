"use client";

import { useMemo, useState } from "react";
import { Maximize2, Minimize2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrgNode } from "./org-node";
import type { OrgMember } from "../types";

function collectIds(node: OrgMember, ids: string[]) {
  ids.push(node.id);
  node.children?.forEach((child) => collectIds(child, ids));
}

function collectMatches(node: OrgMember, term: string, matches: Set<string>) {
  const isMatch =
    node.name.toLowerCase().includes(term) ||
    node.position.toLowerCase().includes(term) ||
    node.department.toLowerCase().includes(term);

  if (isMatch) matches.add(node.id);
  node.children?.forEach((child) => collectMatches(child, term, matches));
}

export function OrgChart({ data }: { data: OrgMember }) {
  const [search, setSearch] = useState("");
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  const allIds = useMemo(() => {
    const ids: string[] = [];
    collectIds(data, ids);
    return ids;
  }, [data]);

  const term = search.trim().toLowerCase();
  const matchIds = useMemo(() => {
    if (!term) return null;
    const matches = new Set<string>();
    collectMatches(data, term, matches);
    return matches;
  }, [data, term]);

  function toggleNode(id: string) {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ค้นหาชื่อ ตำแหน่ง หรือฝ่าย..."
            className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-lg border pr-3 pl-9 text-sm outline-none focus-visible:ring-3"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setCollapsedIds(new Set())}>
            <Maximize2 className="size-3.5" />
            ขยายทั้งหมด
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCollapsedIds(new Set(allIds.filter((id) => id !== data.id)))}
          >
            <Minimize2 className="size-3.5" />
            ย่อทั้งหมด
          </Button>
        </div>
      </div>

      {term && matchIds?.size === 0 && (
        <p className="text-muted-foreground text-sm">
          ไม่พบพนักงานที่ตรงกับ &ldquo;{search}&rdquo;
        </p>
      )}

      <div className="bg-muted/20 overflow-x-auto rounded-2xl border p-8">
        <div className="inline-flex min-w-full justify-center">
          <OrgNode
            node={data}
            collapsedIds={collapsedIds}
            onToggle={toggleNode}
            matchIds={matchIds}
            activeSearch={!!term}
          />
        </div>
      </div>
    </div>
  );
}
