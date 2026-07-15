import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const project = {
  prNo: "PR-2026-0071",
  projectName: "แผนงานรักษาความปลอดภัยและทำความสะอาด ประจำเดือนกรกฎาคม 2569",
  mainQuotationNo: "QT-2026-0152",
  subQuotationNo: "QT-2026-0152-01",
  customerName: "บริษัท เอเชีย รีเทล จำกัด",
  brand: "Planora",
  typeCode: "OUTSOURCE",
  typeName: "Outsource ภาคสนาม",
  startDate: "2026-07-01",
  endDate: "2026-07-31",
  quantity: 31,
  unitPrice: 31774.19,
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
    maximumFractionDigits: 2,
  }).format(value);
}

type BaseField = {
  label: string;
  required?: boolean;
  widthClassName: string;
  emphasis?: boolean;
};

type DetailField =
  | (BaseField & { type: "value"; value: string })
  | (BaseField & {
      type: "input";
      name: string;
      inputType?: "text" | "time";
      placeholder?: string;
    });

type DetailGroup = {
  number: number;
  title: string;
  fields: DetailField[];
};

const groups: DetailGroup[] = [
  {
    number: 1,
    title: "ข้อมูลโครงการ",
    fields: [
      {
        type: "value",
        label: "เลขที่ใบขอซื้อ (PR No.)",
        value: project.prNo,
        required: true,
        widthClassName: "w-40",
      },
      {
        type: "value",
        label: "ชื่อโครงการ (Project Name)",
        value: project.projectName,
        widthClassName: "w-80",
      },
      {
        type: "input",
        label: "ประเภทการจ่ายค่าตอบแทน",
        name: "compensationType",
        placeholder: "เช่น รายวัน หรือรายชั่วโมง",
        required: true,
        widthClassName: "w-56",
      },
      {
        type: "input",
        label: "หมายเหตุ",
        name: "note",
        placeholder: "กรอกหมายเหตุ (ถ้ามี)",
        widthClassName: "w-56",
      },
    ],
  },
  {
    number: 2,
    title: "ข้อมูลใบเสนอราคา",
    fields: [
      {
        type: "value",
        label: "เลขที่ใบเสนอราคาหลัก (Main Quotation No.)",
        value: project.mainQuotationNo,
        widthClassName: "w-64",
      },
      {
        type: "value",
        label: "เลขที่ใบเสนอราคาย่อย (Sub Quotation No.)",
        value: project.subQuotationNo,
        widthClassName: "w-64",
      },
    ],
  },
  {
    number: 3,
    title: "ข้อมูลลูกค้า",
    fields: [
      {
        type: "value",
        label: "ชื่อลูกค้า (Customer Name)",
        value: project.customerName,
        widthClassName: "w-48",
      },
      { type: "value", label: "สินค้า (Brand)", value: project.brand, widthClassName: "w-32" },
      {
        type: "value",
        label: "รหัสประเภท (Type Code)",
        value: project.typeCode,
        widthClassName: "w-40",
      },
      {
        type: "value",
        label: "ชื่อประเภท (Type Name)",
        value: project.typeName,
        widthClassName: "w-48",
      },
    ],
  },
  {
    number: 4,
    title: "ระยะเวลาดำเนินการ",
    fields: [
      {
        type: "value",
        label: "วันที่เริ่มงาน (Start Date)",
        value: formatThaiDate(project.startDate),
        widthClassName: "w-40",
      },
      {
        type: "value",
        label: "วันที่สิ้นสุดงาน (End Date)",
        value: formatThaiDate(project.endDate),
        widthClassName: "w-40",
      },
      {
        type: "input",
        inputType: "time",
        label: "เวลาเริ่มทำงาน (Start Time)",
        name: "startTime",
        required: true,
        widthClassName: "w-52",
      },
      {
        type: "input",
        inputType: "time",
        label: "เวลาสิ้นสุดการทำงาน (End Time)",
        name: "endTime",
        required: true,
        widthClassName: "w-52",
      },
    ],
  },
  {
    number: 5,
    title: "รายละเอียดการเงิน",
    fields: [
      {
        type: "input",
        label: "รอบการจ่ายเงิน (Pay Period)",
        name: "payPeriod",
        placeholder: "เช่น รายเดือน",
        required: true,
        widthClassName: "w-40",
      },
      {
        type: "value",
        label: "จำนวนที่ขอซื้อ (Quantity)",
        value: new Intl.NumberFormat("th-TH").format(project.quantity),
        widthClassName: "w-36",
      },
      {
        type: "value",
        label: "ราคาต่อหน่วย (Unit Price)",
        value: formatAmount(project.unitPrice),
        widthClassName: "w-40",
      },
      {
        type: "value",
        label: "มูลค่ารวม (Total Amount)",
        value: formatAmount(project.totalAmount),
        emphasis: true,
        widthClassName: "w-44",
      },
    ],
  },
];

const rows: DetailGroup[][] = [groups.slice(0, 2), groups.slice(2, 4), groups.slice(4)];

export function PlanOverviewHeader() {
  return (
    <Card className="gap-0 rounded-lg py-0 shadow-sm">
      <CardContent className="flex flex-col gap-6 p-5 sm:p-6">
        {rows.map((rowGroups, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex flex-wrap items-start gap-x-10 gap-y-6 ${
              rowIndex < rows.length - 1 ? "border-border border-b pb-6" : ""
            }`}
          >
            {rowGroups.map((group, groupIndex) => (
              <div
                key={group.number}
                className={`flex flex-col gap-3 ${
                  groupIndex > 0 ? "border-border border-l pl-8" : ""
                }`}
              >
                <div className="flex flex-wrap items-start gap-x-6 gap-y-4">
                  {group.fields.map((field) => (
                    <div key={field.label} className={`min-w-0 ${field.widthClassName}`}>
                      {field.type === "value" ? (
                        <>
                          <p className="text-foreground/60 text-xs leading-snug font-medium">
                            {field.label}
                            {field.required ? (
                              <span className="text-destructive ml-1" aria-label="จำเป็น">
                                *
                              </span>
                            ) : null}
                          </p>
                          {field.emphasis ? (
                            <p
                              className="text-primary border-primary/20 bg-primary/5 mt-1 inline-block rounded-md border px-3 py-1 text-base leading-snug font-bold wrap-break-word tabular-nums"
                              title={field.value}
                            >
                              {field.value}
                            </p>
                          ) : (
                            <p
                              className="text-foreground mt-1 text-sm leading-snug font-semibold wrap-break-word"
                              title={field.value}
                            >
                              {field.value}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <label
                            htmlFor={`project-${field.name}`}
                            className="text-foreground/60 block text-xs leading-snug font-medium"
                          >
                            {field.label}
                            {field.required ? (
                              <span className="text-destructive ml-1" aria-label="จำเป็น">
                                *
                              </span>
                            ) : null}
                          </label>
                          <Input
                            id={`project-${field.name}`}
                            type={field.inputType ?? "text"}
                            name={field.name}
                            placeholder={field.placeholder}
                            required={field.required}
                            className="bg-background mt-1 h-9 text-sm font-medium"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
