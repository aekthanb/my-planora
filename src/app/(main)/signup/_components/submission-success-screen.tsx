import Link from "next/link";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const thaiMonthsShort = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

function formatSubmittedAt(date: Date) {
  const day = date.getDate();
  const month = thaiMonthsShort[date.getMonth()];
  const year = date.getFullYear() + 543;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} · ${hours}:${minutes} น.`;
}

export function SubmissionSuccessScreen({
  applicationNumber,
  submittedAt,
}: {
  applicationNumber: string;
  submittedAt: Date;
}) {
  return (
    <div className="bg-muted flex min-h-svh items-center justify-center p-6">
      <div className="bg-background w-full max-w-2xl rounded-2xl border p-12 text-center shadow-sm">
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-neutral-950 text-white">
          <CheckIcon className="size-9" />
        </span>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">ส่งใบสมัครเรียบร้อยแล้ว</h1>
        <p className="text-muted-foreground mt-3 text-base">
          ขอบคุณที่สมัครร่วมงานกับ Right Now
          <br />
          ทีมสรรหาจะติดต่อกลับภายใน 5 วันทำการผ่านเบอร์โทรหรืออีเมลที่ระบุไว้
        </p>

        <div className="mt-8 rounded-lg border p-6 text-center">
          <p className="text-muted-foreground text-sm">เลขที่ใบสมัคร</p>
          <p className="mt-1 text-2xl font-bold tracking-wide">{applicationNumber}</p>
          <p className="text-muted-foreground mt-2 text-sm">
            ยืนยันด้วย OTP เมื่อ {formatSubmittedAt(submittedAt)} ·
            สำเนาใบสมัครถูกส่งไปที่อีเมลของคุณ
          </p>
        </div>

        <div className="mt-5 rounded-lg border p-6 text-left">
          <p className="text-base font-semibold">สอบถามเรื่องข้อมูลส่วนบุคคลหรือถอนความยินยอม</p>
          <p className="text-muted-foreground mt-2 text-sm">
            เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)
            <br />
            dpo@rightnow.co.th · 02-123-4567 (จ.-ศ. 9:00–18:00 น.)
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button type="button" variant="outline" size="lg">
            ดาวน์โหลดสำเนาใบสมัคร
          </Button>
          <Button size="lg" render={<Link href="/" />} nativeButton={false}>
            กลับสู่หน้าหลัก
          </Button>
        </div>
      </div>
    </div>
  );
}
