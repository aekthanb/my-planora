import type { Metadata } from "next";
import { EnterpriseGridDemo } from "@/components/EnterpriseGridDemo";
// import { PlanOverviewHeader } from "@/components/PlanOverviewHeader";
import "../../../enterprise-grid.css";

export const metadata: Metadata = {
  title: "สร้างแผนงานใหม่ | Planora",
};

export default function NewPlanPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col gap-4">
      {/* <div className="shrink-0 px-4 pt-6 sm:px-6">
        <PlanOverviewHeader />
      </div> */}
      <EnterpriseGridDemo />
    </div>
  );
}
