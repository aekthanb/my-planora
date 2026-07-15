import type { Metadata } from "next";
import { FileCheck2 } from "lucide-react";
import { EnterpriseGridDemo } from "@/components/EnterpriseGridDemo";
import { PlanOverviewHeader } from "@/components/PlanOverviewHeader";
import { PrSelectionPanel } from "@/components/PrSelectionPanel";
import { selectablePrNumbers } from "@/lib/pr-data";
import "../../../enterprise-grid.css";

export const metadata: Metadata = {
  title: "สร้างแผนงานใหม่ | Planora",
};

export default async function NewPlanPage({ searchParams }: PageProps<"/plans/new">) {
  const { project, pr } = await searchParams;
  const projectCode = typeof project === "string" && project.length > 0 ? project : null;
  const prNo =
    typeof pr === "string" && selectablePrNumbers.some((number) => number === pr) ? pr : null;

  if (!projectCode && !prNo) {
    return (
      <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 p-6 text-center font-sans dark:bg-black">
        <div className="border-border bg-background flex size-14 items-center justify-center rounded-full border">
          <FileCheck2 className="text-muted-foreground size-6" aria-hidden />
        </div>
        <div className="space-y-1">
          <h1 className="text-foreground text-lg font-semibold">ยังไม่ได้เลือก PR</h1>
          <p className="text-muted-foreground max-w-sm text-sm">
            เลือกใบขอซื้อ (PR) ที่อนุมัติแล้วเพื่อใช้เป็นข้อมูลตั้งต้นของแผนงานใหม่
          </p>
        </div>
        <PrSelectionPanel />
      </main>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <div className="shrink-0 px-2 pt-2">
        <PlanOverviewHeader />
      </div>
      <EnterpriseGridDemo key={projectCode ?? prNo} showMockData={Boolean(projectCode)} />
    </div>
  );
}
