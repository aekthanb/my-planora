import { Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type PlanStatus = "กำลังดำเนินการ" | "รออนุมัติ" | "เสร็จสิ้น" | "ล่าช้า";

const planStatusStyles: Record<PlanStatus, { dot: string; text: string }> = {
  กำลังดำเนินการ: { dot: "bg-primary", text: "text-foreground" },
  รออนุมัติ: { dot: "bg-muted-foreground", text: "text-foreground" },
  เสร็จสิ้น: { dot: "bg-primary", text: "text-foreground" },
  ล่าช้า: { dot: "bg-destructive", text: "text-destructive" },
};

const plan = {
  prNo: "PR-2026-0071",
  alNo: "AL-2026-0048",
  mainQuotation: "QT-2026-0152",
  subQuotation: "QT-2026-0152-01",
  customer: "บริษัท เอเชีย รีเทล จำกัด",
  brand: "Planora",
  project: "แผนงานรักษาความปลอดภัยและทำความสะอาด ประจำเดือนกรกฎาคม 2569",
  jobType: "Outsource ภาคสนาม",
  compensationType: "รายวัน",
  date: "2026-07-01",
  workTime: "08:00 – 17:00",
  quantity: 31,
  totalAmount: 985000,
  status: "กำลังดำเนินการ" as PlanStatus,
};

function formatThaiDate(value: string) {
  return new Date(value).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

const fields = [
  { label: "PR NO", value: plan.prNo },
  { label: "AL NO", value: plan.alNo },
  { label: "Main Quotation", value: plan.mainQuotation },
  { label: "Sub Quotation", value: plan.subQuotation },
  { label: "Customer", value: plan.customer },
  { label: "Brand", value: plan.brand },
  { label: "Project", value: plan.project },
  { label: "Job Type", value: plan.jobType },
  { label: "Compensation Type", value: plan.compensationType },
  { label: "Date", value: formatThaiDate(plan.date) },
  { label: "Work Time", value: plan.workTime },
  { label: "Quantity", value: `${plan.quantity} วัน` },
  { label: "Total Amount", value: formatAmount(plan.totalAmount) },
];

export function PlanOverviewHeader() {
  const status = planStatusStyles[plan.status];

  return (
    <Card className="gap-0 rounded-lg py-0 shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="bg-muted text-muted-foreground inline-flex shrink-0 rounded-md p-2">
              <Briefcase className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="text-muted-foreground text-xs font-medium">รายละเอียดโครงการ</p>
              <h2 className="text-foreground text-base leading-snug font-semibold">
                Project Detail
              </h2>
            </div>
          </div>

          <span className="border-border bg-background inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-xs">
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden />
            <span className={status.text}>{plan.status}</span>
          </span>
        </div>

        <dl className="bg-border border-border grid grid-cols-2 gap-px border-t sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {fields.map(({ label, value }) => (
            <div
              key={label}
              className={`min-w-0 px-4 py-3 sm:px-5 ${
                label === "Total Amount"
                  ? "bg-muted/60 col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-3"
                  : "bg-card"
              }`}
            >
              <dt className="text-muted-foreground text-xs font-medium">{label}</dt>
              <dd
                className={`text-foreground mt-0.5 truncate font-semibold ${
                  label === "Total Amount" ? "text-base" : "text-sm"
                }`}
                title={value}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
