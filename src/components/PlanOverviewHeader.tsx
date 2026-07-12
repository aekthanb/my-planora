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

const planStatusStyles: Record<PlanStatus, string> = {
  กำลังดำเนินการ: "bg-secondary text-secondary-foreground",
  รออนุมัติ: "bg-accent text-accent-foreground",
  เสร็จสิ้น: "bg-primary text-primary-foreground",
  ล่าช้า: "bg-destructive/10 text-destructive",
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

export function PlanOverviewHeader() {
  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <CardDescription>{plan.type}</CardDescription>
        <CardTitle className="text-foreground text-xl">{plan.name}</CardTitle>
        <CardAction>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${planStatusStyles[plan.status]}`}
          >
            {plan.status}
          </span>
        </CardAction>
      </CardHeader>

      <CardContent>
        <Separator className="mb-4" />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <p className="text-muted-foreground text-xs font-medium">ผู้รับผิดชอบ</p>
            <p className="text-foreground mt-1 text-sm font-semibold">{plan.owner}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">ฝ่าย</p>
            <p className="text-foreground mt-1 text-sm font-semibold">{plan.department}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">วันเริ่ม</p>
            <p className="text-foreground mt-1 text-sm font-semibold">
              {formatThaiDate(plan.startDate)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">วันสิ้นสุด</p>
            <p className="text-foreground mt-1 text-sm font-semibold">
              {formatThaiDate(plan.endDate)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">งบประมาณ</p>
            <p className="text-foreground mt-1 text-sm font-semibold">
              {formatBudget(plan.budget)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
