import type { Metadata } from "next";
import { EnterpriseGridDemo } from "@/components/EnterpriseGridDemo";
// import { PlanOverviewHeader } from "@/components/PlanOverviewHeader";
import "../../../enterprise-grid.css";

export const metadata: Metadata = {
  title: "สร้างแผนงานใหม่ | Planora",
};

export default async function NewPlanPage({ searchParams }: PageProps<"/plans/new">) {
  const { project } = await searchParams;
  const selectedProject = typeof project === "string" && project.length > 0;

  return (
    <div className="flex min-h-full flex-1 flex-col gap-4">
      {/* <div className="shrink-0 px-4 pt-6 sm:px-6">
        <PlanOverviewHeader />
      </div> */}
      <EnterpriseGridDemo
        key={selectedProject ? project : "blank"}
        showMockData={selectedProject}
      />
    </div>
  );
}
