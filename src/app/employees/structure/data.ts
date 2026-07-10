import type { OrgMember } from "./types";

export const orgChartData: OrgMember = {
  id: "ceo",
  name: "สมชาย วัฒนาชัย",
  position: "ประธานเจ้าหน้าที่บริหาร (CEO)",
  department: "ผู้บริหารระดับสูง",
  children: [
    {
      id: "hr-director",
      name: "นภัสวรรณ ศรีสุข",
      position: "ผู้อำนวยการฝ่ายทรัพยากรบุคคล",
      department: "ฝ่ายทรัพยากรบุคคล",
      children: [
        {
          id: "hr-recruit-lead",
          name: "พิมพ์ชนก แสงทอง",
          position: "หัวหน้าทีมสรรหาบุคลากร",
          department: "ฝ่ายทรัพยากรบุคคล",
          children: [
            {
              id: "hr-recruit-1",
              name: "อรพรรณ ดวงใจ",
              position: "เจ้าหน้าที่สรรหาบุคลากร",
              department: "ฝ่ายทรัพยากรบุคคล",
            },
            {
              id: "hr-recruit-2",
              name: "ธีรพัฒน์ บุญมี",
              position: "เจ้าหน้าที่สรรหาบุคลากร",
              department: "ฝ่ายทรัพยากรบุคคล",
            },
          ],
        },
        {
          id: "hr-training-lead",
          name: "กิตติศักดิ์ รุ่งเรือง",
          position: "หัวหน้าทีมฝึกอบรมและพัฒนา",
          department: "ฝ่ายทรัพยากรบุคคล",
          children: [
            {
              id: "hr-training-1",
              name: "สุพัตรา ใจงาม",
              position: "เจ้าหน้าที่ฝึกอบรม",
              department: "ฝ่ายทรัพยากรบุคคล",
            },
          ],
        },
      ],
    },
    {
      id: "cfo",
      name: "วิชัย เจริญสุข",
      position: "ผู้อำนวยการฝ่ายการเงินและบัญชี",
      department: "ฝ่ายการเงินและบัญชี",
      children: [
        {
          id: "finance-accounting-lead",
          name: "อรุณี พงษ์ไทย",
          position: "หัวหน้าทีมบัญชี",
          department: "ฝ่ายการเงินและบัญชี",
          children: [
            {
              id: "finance-accounting-1",
              name: "กาญจนา ทองดี",
              position: "นักบัญชี",
              department: "ฝ่ายการเงินและบัญชี",
            },
            {
              id: "finance-accounting-2",
              name: "ประภาส วงศ์สวัสดิ์",
              position: "นักบัญชี",
              department: "ฝ่ายการเงินและบัญชี",
            },
          ],
        },
        {
          id: "finance-lead",
          name: "สมหญิง จันทร์เพ็ญ",
          position: "หัวหน้าทีมการเงิน",
          department: "ฝ่ายการเงินและบัญชี",
          children: [
            {
              id: "finance-1",
              name: "ธนกร ศักดิ์สิทธิ์",
              position: "เจ้าหน้าที่การเงิน",
              department: "ฝ่ายการเงินและบัญชี",
            },
          ],
        },
      ],
    },
    {
      id: "cto",
      name: "อนุชา ทรัพย์มาก",
      position: "ผู้อำนวยการฝ่ายเทคโนโลยีสารสนเทศ",
      department: "ฝ่ายเทคโนโลยีสารสนเทศ",
      children: [
        {
          id: "it-frontend-lead",
          name: "ปิยะดา รัตนโกสินทร์",
          position: "หัวหน้าทีม Frontend",
          department: "ฝ่ายเทคโนโลยีสารสนเทศ",
          children: [
            {
              id: "it-frontend-1",
              name: "จิรายุ เกียรติคุณ",
              position: "Frontend Developer",
              department: "ฝ่ายเทคโนโลยีสารสนเทศ",
            },
            {
              id: "it-frontend-2",
              name: "ณัฐริกา พูนสุข",
              position: "Frontend Developer",
              department: "ฝ่ายเทคโนโลยีสารสนเทศ",
            },
          ],
        },
        {
          id: "it-backend-lead",
          name: "วรากร สินสมบูรณ์",
          position: "หัวหน้าทีม Backend",
          department: "ฝ่ายเทคโนโลยีสารสนเทศ",
          children: [
            {
              id: "it-backend-1",
              name: "ภาณุวัฒน์ ชัยมงคล",
              position: "Backend Developer",
              department: "ฝ่ายเทคโนโลยีสารสนเทศ",
            },
            {
              id: "it-backend-2",
              name: "ศิริพร แก้วมณี",
              position: "Backend Developer",
              department: "ฝ่ายเทคโนโลยีสารสนเทศ",
            },
          ],
        },
        {
          id: "it-qa-lead",
          name: "เบญจมาศ อินทร์แก้ว",
          position: "หัวหน้าทีม QA",
          department: "ฝ่ายเทคโนโลยีสารสนเทศ",
          children: [
            {
              id: "it-qa-1",
              name: "ธัญญารัตน์ โพธิ์ทอง",
              position: "QA Engineer",
              department: "ฝ่ายเทคโนโลยีสารสนเทศ",
            },
          ],
        },
      ],
    },
    {
      id: "sales-director",
      name: "ดวงพร ศิริวัฒนกุล",
      position: "ผู้อำนวยการฝ่ายขายและการตลาด",
      department: "ฝ่ายขายและการตลาด",
      children: [
        {
          id: "sales-lead",
          name: "เอกชัย มหาชัย",
          position: "หัวหน้าทีมขาย",
          department: "ฝ่ายขายและการตลาด",
          children: [
            {
              id: "sales-1",
              name: "สุนิสา รักษ์ดี",
              position: "เจ้าหน้าที่ขาย",
              department: "ฝ่ายขายและการตลาด",
            },
            {
              id: "sales-2",
              name: "กฤษดา ทวีทรัพย์",
              position: "เจ้าหน้าที่ขาย",
              department: "ฝ่ายขายและการตลาด",
            },
          ],
        },
        {
          id: "marketing-lead",
          name: "พรทิพย์ วิไลลักษณ์",
          position: "หัวหน้าทีมการตลาด",
          department: "ฝ่ายขายและการตลาด",
          children: [
            {
              id: "marketing-1",
              name: "นันทวัฒน์ ชื่นบาน",
              position: "เจ้าหน้าที่การตลาด",
              department: "ฝ่ายขายและการตลาด",
            },
          ],
        },
      ],
    },
    {
      id: "coo",
      name: "สุรชัย ปัญญาวุฒิ",
      position: "ผู้อำนวยการฝ่ายปฏิบัติการ",
      department: "ฝ่ายปฏิบัติการ",
      children: [
        {
          id: "ops-lead-1",
          name: "มัลลิกา สุขสมบูรณ์",
          position: "หัวหน้าทีมปฏิบัติการ 1",
          department: "ฝ่ายปฏิบัติการ",
        },
        {
          id: "ops-lead-2",
          name: "ธีรภัทร วงศ์ไพศาล",
          position: "หัวหน้าทีมปฏิบัติการ 2",
          department: "ฝ่ายปฏิบัติการ",
        },
      ],
    },
  ],
};

function countMembers(node: OrgMember): number {
  const childCount = node.children?.reduce((sum, child) => sum + countMembers(child), 0) ?? 0;
  return 1 + childCount;
}

function collectDepartments(node: OrgMember, departments: Set<string>) {
  departments.add(node.department);
  node.children?.forEach((child) => collectDepartments(child, departments));
}

function getDepth(node: OrgMember): number {
  if (!node.children?.length) return 1;
  return 1 + Math.max(...node.children.map(getDepth));
}

export function getOrgStats(root: OrgMember) {
  const departments = new Set<string>();
  collectDepartments(root, departments);

  return {
    totalMembers: countMembers(root),
    totalDepartments: departments.size,
    levels: getDepth(root),
  };
}
