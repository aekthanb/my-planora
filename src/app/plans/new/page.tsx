import type { Metadata } from "next";
import { EnterpriseGridDemo } from "@/components/EnterpriseGridDemo";
import { PlanOverviewHeader } from "@/components/PlanOverviewHeader";
import "../../enterprise-grid.css";

export const metadata: Metadata = {
  title: "สร้างแผนงานใหม่ | Planora",
};

export default function NewPlanPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="shrink-0 px-1.5 pt-2 sm:px-2">
        <PlanOverviewHeader />
      </div>
      <EnterpriseGridDemo />
    </div>
  );
}
