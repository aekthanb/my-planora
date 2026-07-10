"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const applicantTypes = [
  {
    code: "E11",
    title: "พนักงานประจำ",
    description: "พนักงานสัญญาจ้างประจำของบริษัท รับสวัสดิการเต็มรูปแบบ",
    badgeClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
  },
  {
    code: "K21",
    title: "KA Front Office",
    description: "เจ้าหน้าที่ Key Account ส่วนงานบริการหน้าร้านและลูกค้า",
    badgeClass: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-400",
  },
  {
    code: "K12",
    title: "KA Back Office",
    description: "เจ้าหน้าที่ Key Account ส่วนงานสนับสนุนหลังบ้าน",
    badgeClass: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-400",
  },
  {
    code: "C10",
    title: "พนักงาน Service Contact",
    description: "พนักงานสัญญาจ้างบริการตามสัญญาจ้างตามระยะเวลา",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  {
    code: "O20",
    title: "ผู้ให้บริการ Outsource",
    description: "ผู้ให้บริการภายนอกหรือพาร์ทเนอร์ที่รับงานผ่านแพลตฟอร์มของบริษัท",
    badgeClass: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-400",
    fullWidth: true,
  },
];

export function ApplicantTypeStep({ onNext }: { onNext: (code: string) => void }) {
  const [selected, setSelected] = useState(applicantTypes[0]!.code);
  const selectedType = applicantTypes.find((type) => type.code === selected)!;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <p className="text-muted-foreground text-sm">ขั้นตอนที่ 1 จาก 4</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">คุณสมัครในฐานะอะไร?</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        เลือกประเภทผู้สมัคร 1 ประเภท — ประเภทที่เลือกมีผลต่อเอกสารความยินยอมในขั้นตอนที่ 3
      </p>

      <div role="radiogroup" aria-label="ประเภทผู้สมัคร" className="mt-8 grid gap-4 sm:grid-cols-2">
        {applicantTypes.map((type) => {
          const isSelected = type.code === selected;
          return (
            <button
              key={type.code}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelected(type.code)}
              className={cn(
                "focus-visible:border-ring focus-visible:ring-ring/50 relative flex flex-col items-start gap-2 rounded-xl border p-5 text-left transition-colors outline-none focus-visible:ring-3",
                type.fullWidth && "sm:col-span-2",
                isSelected ? "border-foreground" : "border-border hover:border-foreground/30",
              )}
            >
              {isSelected && (
                <span className="bg-foreground text-background absolute top-4 right-4 flex size-5 items-center justify-center rounded-full">
                  <CheckIcon className="size-3" />
                </span>
              )}
              <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold", type.badgeClass)}>
                {type.code}
              </span>
              <span className="font-semibold">{type.title}</span>
              <span className="text-muted-foreground text-sm">{type.description}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <p className="text-muted-foreground text-sm">
          เลือกแล้ว:{" "}
          <span className="text-foreground font-medium">
            {selectedType.code} {selectedType.title}
          </span>
        </p>
        <Button type="button" size="lg" onClick={() => onNext(selected)}>
          ถัดไป →
        </Button>
      </div>
    </div>
  );
}
