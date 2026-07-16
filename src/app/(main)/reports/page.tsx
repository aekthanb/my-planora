import type { Metadata } from "next";
import { ReportsDashboard } from "./_components/reports-dashboard";

export const metadata: Metadata = {
  title: "รายงาน | Planora",
  description: "ภาพรวมผลการดำเนินงาน กำลังคน และแผนงานของ Planora",
};

export default function ReportsPage() {
  return <ReportsDashboard />;
}
