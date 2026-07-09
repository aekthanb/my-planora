import { Button } from "@/components/ui/button";

const stepInfo: Record<number, { title: string; description: string }> = {
  2: {
    title: "ข้อมูลผู้สมัคร",
    description: "ข้อมูลติดต่อและเอกสาร",
  },
  3: {
    title: "ความยินยอม PDPA",
    description: "นโยบายคุ้มครองข้อมูล",
  },
  4: {
    title: "ยืนยันและส่งใบสมัคร",
    description: "ตรวจสอบและยืนยัน OTP",
  },
};

export function ComingSoonStep({ step, onBack }: { step: number; onBack: () => void }) {
  const info = stepInfo[step];

  return (
    <div className="mx-auto w-full max-w-5xl">
      <p className="text-muted-foreground text-sm">ขั้นตอนที่ {step} จาก 4</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{info?.title}</h1>
      <p className="text-muted-foreground mt-2 text-sm">{info?.description}</p>

      <div className="border-border text-muted-foreground mt-8 rounded-xl border border-dashed p-10 text-center text-sm">
        ขั้นตอนนี้อยู่ระหว่างจัดเตรียมเนื้อหา
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          ← ย้อนกลับ
        </Button>
      </div>
    </div>
  );
}
