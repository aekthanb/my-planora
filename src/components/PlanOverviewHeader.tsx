import { Card, CardContent } from "@/components/ui/card";

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
  return (
    <Card className="gap-0 rounded-lg py-0 shadow-sm">
      <CardContent className="p-0">
        <dl className="bg-border grid gap-px sm:grid-cols-2 xl:grid-cols-4">
          {fields.map(({ label, value }) => (
            <div
              key={label}
              className={`min-w-0 px-4 py-3.5 sm:min-h-18 sm:px-5 ${
                label === "Total Amount" ? "bg-muted/60 sm:col-span-2 xl:col-span-4" : "bg-card"
              }`}
            >
              <dt className="text-muted-foreground text-xs font-medium">{label}</dt>
              <dd
                className={`text-foreground mt-1 leading-snug font-semibold break-words ${
                  label === "Total Amount" ? "text-lg tabular-nums" : "text-sm sm:text-base"
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
