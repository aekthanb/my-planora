import type { Metadata } from "next";
import { EnterpriseGridDemo } from "@/components/EnterpriseGridDemo";
import "../../enterprise-grid.css";

export const metadata: Metadata = {
  title: "สร้างแผนงานใหม่ | Planora",
};

export default function NewPlanPage() {
  return <EnterpriseGridDemo />;
}
