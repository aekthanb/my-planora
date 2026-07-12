"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ConsentSummary } from "./pdpa-consent-step";

const applicantTypeTitles: Record<string, string> = {
  E11: "พนักงานประจำ",
  K21: "KA Front Office",
  K12: "KA Back Office",
  C10: "พนักงาน Service Contact",
  O20: "ผู้ให้บริการ Outsource",
};

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

function formatConsentTimestamp(date: Date) {
  const day = date.getDate();
  const month = thaiMonthsShort[date.getMonth()];
  const year = date.getFullYear() + 543;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
}

function ReviewCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{title}</p>
        <button
          type="button"
          onClick={onEdit}
          className="text-primary text-xs font-medium hover:underline"
        >
          แก้ไข
        </button>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

export function ReviewSubmitStep({
  applicantType,
  consent,
  onBack,
  onEditStep,
  onSubmit,
}: {
  applicantType: string;
  consent: ConsentSummary | null;
  onBack: () => void;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
}) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const otpComplete = otp.every((digit) => digit !== "");
  const timerLabel = `00:${String(secondsLeft).padStart(2, "0")}`;

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleResend() {
    setSecondsLeft(RESEND_SECONDS);
  }

  const applicantTitle = applicantTypeTitles[applicantType] ?? applicantType;
  const consentSummaryParts = consent
    ? [
        consent.readAcknowledged && "รับทราบนโยบายฯ",
        consent.consentProcessing && "ยินยอมข้อมูลส่วนบุคคล",
        consent.consentSensitive && "ยินยอมข้อมูลอ่อนไหว",
      ].filter(Boolean)
    : [];

  return (
    <div className="mx-auto w-full max-w-5xl">
      <p className="text-muted-foreground text-sm">ขั้นตอนที่ 4 จาก 4</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">ตรวจสอบข้อมูลและยืนยันตัวตน</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        ตรวจสอบความถูกต้องของข้อมูลทั้งหมด แล้วยืนยันตัวตนด้วยรหัส OTP แทนการลงนามในเอกสารกระดาษ
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-4">
          <ReviewCard title="ประเภทผู้สมัคร" onEdit={() => onEditStep(1)}>
            <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400">
              {applicantType}
            </span>{" "}
            <span className="text-sm font-medium">{applicantTitle}</span>
          </ReviewCard>

          <ReviewCard title="ข้อมูลส่วนตัว" onEdit={() => onEditStep(2)}>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground inline">ชื่อ-นามสกุล: </dt>
                <dd className="inline font-medium">สมชาย ใจดี</dd>
              </div>
              <div>
                <dt className="text-muted-foreground inline">เลขบัตรประชาชน: </dt>
                <dd className="inline font-medium">1-1037-00234-56-7</dd>
              </div>
              <div>
                <dt className="text-muted-foreground inline">วันเกิด: </dt>
                <dd className="inline font-medium">14 มีนาคม 2540 (เพศชาย · สัญชาติไทย)</dd>
              </div>
              <div>
                <dt className="text-muted-foreground inline">ที่อยู่: </dt>
                <dd className="inline font-medium">128/45 ซ.ลาดพร้าว เขตจตุจักร กรุงเทพฯ 10900</dd>
              </div>
              <div>
                <dt className="text-muted-foreground inline">ติดต่อ: </dt>
                <dd className="inline font-medium">081-234-5678 · somchai.j@example.com</dd>
              </div>
              <div>
                <dt className="text-muted-foreground inline">การศึกษา: </dt>
                <dd className="inline font-medium">ป.ตรี บริหารธุรกิจ ม.รามคำแหง (2562)</dd>
              </div>
              <div>
                <dt className="text-muted-foreground inline">การทำงาน: </dt>
                <dd className="inline font-medium">
                  เจ้าหน้าที่บริการลูกค้า บจก.เอบีซี เซอร์วิส (2562-ปัจจุบัน)
                </dd>
              </div>
            </dl>
          </ReviewCard>

          <ReviewCard title="เอกสารแนบ" onEdit={() => onEditStep(2)}>
            <ul className="space-y-2 text-sm">
              {[
                ["รูปถ่าย", "photo-somchai.jpg"],
                ["สำเนาบัตรประชาชน", "id-card-somchai.pdf"],
                ["สำเนาทะเบียนบ้าน", "house-reg-somchai.pdf"],
              ].map(([label, filename]) => (
                <li key={label} className="flex items-center gap-2">
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white">
                    <svg viewBox="0 0 24 24" className="size-2.5" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-muted-foreground">
                    {label} — {filename}
                  </span>
                </li>
              ))}
            </ul>
          </ReviewCard>

          <ReviewCard title="ความยินยอม PDPA" onEdit={() => onEditStep(3)}>
            {consent ? (
              <>
                <p className="text-muted-foreground text-sm">{consentSummaryParts.join(" · ")}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  ให้ความยินยอมเมื่อ {formatConsentTimestamp(consent.consentedAt)}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">ยังไม่ได้ให้ความยินยอม</p>
            )}
          </ReviewCard>
        </div>

        <div className="h-fit rounded-xl border p-5">
          <p className="text-sm font-semibold">ยืนยันตัวตนทางอิเล็กทรอนิกส์</p>
          <p className="text-muted-foreground mt-2 text-xs">
            การกรอกรหัส OTP ถือเป็นการลงลายมือชื่ออิเล็กทรอนิกส์ยืนยันความถูกต้องของใบสมัคร
            แทนการลงนามในเอกสารกระดาษ
          </p>

          <p className="mt-4 text-xs font-medium">รหัสยืนยัน 6 หลักถูกส่งไปที่ 081-xxx-5678</p>

          <div className="mt-3 flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => updateDigit(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-12 w-11 rounded-lg border text-center text-lg font-semibold outline-none focus-visible:ring-3"
              />
            ))}
          </div>

          <p className="mt-3 text-xs">
            {secondsLeft > 0 ? (
              <span className="text-muted-foreground">ส่งรหัสอีกครั้งได้ใน {timerLabel}</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-primary font-medium hover:underline"
              >
                ส่งรหัสอีกครั้ง
              </button>
            )}
            {" · "}
            <button type="button" className="text-primary font-medium hover:underline">
              เปลี่ยนเบอร์โทร
            </button>
          </p>

          <Button
            type="button"
            size="lg"
            className="mt-4 w-full"
            disabled={!otpComplete}
            onClick={onSubmit}
          >
            ยืนยันและส่งใบสมัคร
          </Button>

          <p className="text-muted-foreground mt-3 text-xs">
            ระบบจะบันทึกวันเวลา หมายเลขเครื่อง และ IP address เป็นหลักฐานการยืนยัน
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          ← ย้อนกลับ
        </Button>
      </div>
    </div>
  );
}
