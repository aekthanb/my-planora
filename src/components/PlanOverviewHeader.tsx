import { Briefcase, Building2, CalendarDays, UserRound, Wallet } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type PlanStatus = "กำลังดำเนินการ" | "รออนุมัติ" | "เสร็จสิ้น" | "ล่าช้า";

const planStatusStyles: Record<PlanStatus, { dot: string; text: string }> = {
  กำลังดำเนินการ: { dot: "bg-primary", text: "text-foreground" },
  รออนุมัติ: { dot: "bg-muted-foreground", text: "text-foreground" },
  เสร็จสิ้น: { dot: "bg-primary", text: "text-foreground" },
  ล่าช้า: { dot: "bg-destructive", text: "text-destructive" },
};

const plan = {
  name: "แผนงานรักษาความปลอดภัยและทำความสะอาด ประจำเดือนกรกฎาคม 2569",
  type: "โครงการ Outsource ภาคสนาม",
  owner: "มาลี เกษมสุข",
  department: "ฝ่ายปฏิบัติการ",
  startDate: "2026-07-01",
  endDate: "2026-07-31",
  budget: 985000,
  status: "กำลังดำเนินการ" as PlanStatus,
};

function formatThaiDate(value: string) {
  return new Date(value).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatBudget(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

const fields = [
  { icon: UserRound, label: "ผู้รับผิดชอบ", value: plan.owner },
  { icon: Building2, label: "ฝ่าย", value: plan.department },
  { icon: CalendarDays, label: "วันเริ่ม", value: formatThaiDate(plan.startDate) },
  { icon: CalendarDays, label: "วันสิ้นสุด", value: formatThaiDate(plan.endDate) },
  { icon: Wallet, label: "งบประมาณ", value: formatBudget(plan.budget) },
];

export function PlanOverviewHeader() {
  const status = planStatusStyles[plan.status];

  return (
    <Card className="rounded-xl py-6 shadow-sm">
      <CardHeader className="gap-2 px-6">
        <CardDescription className="flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5" aria-hidden />
          {plan.type}
        </CardDescription>
        <CardTitle className="text-foreground text-xl">{plan.name}</CardTitle>
        <CardAction>
          <span className="border-border bg-card inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm">
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            <span className={status.text}>{plan.status}</span>
          </span>
        </CardAction>
      </CardHeader>

      <CardContent className="px-6">
        <Separator className="mt-2 mb-5" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {fields.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="border-border bg-muted/40 flex items-start gap-3 rounded-lg border p-3.5"
            >
              <span className="bg-background border-border text-muted-foreground mt-0.5 shrink-0 rounded-full border p-2">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="text-muted-foreground block text-xs font-medium">{label}</span>
                <span className="text-foreground mt-1 block truncate text-sm font-semibold">
                  {value}
                </span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
