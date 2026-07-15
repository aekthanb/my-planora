const projectTemplates = [
  "แผนงานรักษาความปลอดภัยและทำความสะอาด",
  "แผนงานบำรุงรักษาอาคาร",
  "แผนงานบริการรักษาความปลอดภัยภาคสนาม",
  "แผนงานทำความสะอาดพื้นที่ส่วนกลาง",
  "แผนงานดูแลภูมิทัศน์และสวน",
];

const jobCodes = ["OUTSOURCE", "MAINT-SVC", "SEC-FIELD", "CLEAN-SVC", "LANDSCAPE"];

const remarkTemplates = ["-", "รอเอกสารเพิ่มเติม", "อนุมัติเร่งด่วน", "ต่ออายุสัญญาเดิม"];

function formatThaiDate(date: Date) {
  return date.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
}

function formatThaiMonthYear(date: Date) {
  return date.toLocaleDateString("th-TH", { month: "long", year: "numeric" });
}

const mockPrCount = 50;
const baseDate = new Date(2026, 6, 1);

export const selectablePrNumbers = Array.from(
  { length: mockPrCount },
  (_, index) => `PR-2026-${String(71 + index).padStart(4, "0")}`,
);

export const purchaseRequests = selectablePrNumbers.map((prNo, index) => {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + index * 5);

  const projectTemplate = projectTemplates[index % projectTemplates.length]!;

  return {
    prNo,
    date: formatThaiDate(date),
    refCode: `QT-2026-${String(152 + index).padStart(4, "0")}`,
    projectName: `${projectTemplate} ประจำเดือน${formatThaiMonthYear(date)}`,
    jobCode: jobCodes[index % jobCodes.length]!,
    remark: remarkTemplates[index % remarkTemplates.length]!,
  };
});
