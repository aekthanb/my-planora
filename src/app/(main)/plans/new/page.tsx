import type { Metadata } from "next";
import { EnterpriseGridDemo } from "@/components/EnterpriseGridDemo";
import { PlanOverviewHeader } from "@/components/PlanOverviewHeader";
import { PrSelectionPanel, selectablePrNumbers } from "@/components/PrSelectionPanel";
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
      <main className="flex min-h-full flex-1 flex-col bg-zinc-50 px-2 pt-2 font-sans dark:bg-black">
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
