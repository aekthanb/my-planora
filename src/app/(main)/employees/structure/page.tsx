import type { Metadata } from "next";
import { OrgChart } from "./_components/org-chart";
import { OrgStats } from "./_components/org-stats";
import { getOrgStats, orgChartData } from "./data";

export const metadata: Metadata = {
  title: "โครงสร้างองค์กร | Planora",
};

export default function OrgStructurePage() {
  const stats = getOrgStats(orgChartData);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <section className="mx-auto w-full max-w-6xl px-8 py-12">
        <div>
          <p className="text-primary text-sm font-medium">พนักงาน</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">โครงสร้างองค์กร</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-base">
            ดูและจัดการผังโครงสร้างองค์กร ตั้งแต่ระดับผู้บริหารจนถึงพนักงานในแต่ละฝ่าย
          </p>
        </div>

        <div className="mt-8">
          <OrgStats {...stats} />
        </div>

        <div className="mt-8">
          <OrgChart data={orgChartData} />
        </div>
      </section>
    </div>
  );
}
