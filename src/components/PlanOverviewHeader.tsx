import { Card, CardContent } from "@/components/ui/card";

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

type DetailField = {
  label: string;
  value: string;
  required?: boolean;
  widthClassName: string;
};

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
        label: "เลขที่ใบขอซื้อ (PR No.)",
        value: project.prNo,
        required: true,
        widthClassName: "w-40",
      },
      {
        label: "ชื่อโครงการ (Project Name)",
        value: project.projectName,
        widthClassName: "w-80",
      },
    ],
  },
  {
    number: 2,
    title: "ข้อมูลใบเสนอราคา",
    fields: [
      {
        label: "เลขที่ใบเสนอราคาหลัก (Main Quotation No.)",
        value: project.mainQuotationNo,
        widthClassName: "w-64",
      },
      {
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
      { label: "ชื่อลูกค้า (Customer Name)", value: project.customerName, widthClassName: "w-48" },
      { label: "สินค้า (Brand)", value: project.brand, widthClassName: "w-32" },
      { label: "รหัสประเภท (Type Code)", value: project.typeCode, widthClassName: "w-40" },
      { label: "ชื่อประเภท (Type Name)", value: project.typeName, widthClassName: "w-48" },
    ],
  },
  {
    number: 4,
    title: "ระยะเวลาดำเนินการ",
    fields: [
      {
        label: "วันที่เริ่มงาน (Start Date)",
        value: formatThaiDate(project.startDate),
        widthClassName: "w-40",
      },
      {
        label: "วันที่สิ้นสุดงาน (End Date)",
        value: formatThaiDate(project.endDate),
        widthClassName: "w-40",
      },
    ],
  },
  {
    number: 5,
    title: "รายละเอียดการเงิน",
    fields: [
      {
        label: "จำนวนที่ขอซื้อ (Quantity)",
        value: new Intl.NumberFormat("th-TH").format(project.quantity),
        widthClassName: "w-36",
      },
      {
        label: "ราคาต่อหน่วย (Unit Price)",
        value: formatAmount(project.unitPrice),
        widthClassName: "w-40",
      },
    ],
  },
];

const sections: DetailGroup[][] = [groups.slice(0, 2), groups.slice(2)];

export function PlanOverviewHeader() {
  return (
    <Card className="gap-0 rounded-t-lg rounded-b-none py-0 shadow-sm">
      <CardContent className="flex flex-col gap-6 p-5 sm:p-6">
        {sections.map((sectionGroups, sectionIndex) => (
          <div
            key={sectionIndex}
            className={`flex flex-wrap items-start gap-x-10 gap-y-6 ${
              sectionIndex < sections.length - 1 ? "border-border border-b pb-6" : ""
            }`}
          >
            {sectionGroups.map((group) => (
              <div key={group.number} className="flex flex-col gap-3">
                <div className="flex flex-wrap items-start gap-x-6 gap-y-4">
                  {group.fields.map((field) => (
                    <div key={field.label} className={`min-w-0 ${field.widthClassName}`}>
                      <p className="text-foreground/60 text-xs leading-snug font-medium">
                        {field.label}
                        {field.required ? (
                          <span className="text-destructive ml-1" aria-label="จำเป็น">
                            *
                          </span>
                        ) : null}
                      </p>
                      <p
                        className="text-foreground mt-1 text-sm leading-snug font-semibold wrap-break-word"
                        title={field.value}
                      >
                        {field.value}
                      </p>
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
