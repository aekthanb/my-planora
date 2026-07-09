import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const personalInfoSubSteps = [
  { id: 1, label: "ข้อมูลส่วนตัว", done: true },
  { id: 2, label: "ที่อยู่ทะเบียนบ้าน", done: true },
  { id: 3, label: "ที่อยู่ปัจจุบัน", done: true },
  { id: 4, label: "ครอบครัว", done: true },
  { id: 5, label: "ติดต่อฉุกเฉิน", done: true },
  { id: 6, label: "สถานะสมรส", done: true },
  { id: 7, label: "สถานภาพทางทหาร", done: false },
  { id: 8, label: "การศึกษา", done: false },
  { id: 9, label: "การทำงาน", done: false },
  { id: 10, label: "สุขภาพ", done: false },
  { id: 11, label: "ฝึกอบรม", done: false },
  { id: 12, label: "ภาษา", done: false },
  { id: 13, label: "ข้อมูลเพิ่มเติม", done: false },
  { id: 14, label: "เอกสารแนบ", done: false },
];

const steps = [
  { number: 1, title: "ประเภทผู้สมัคร", description: "เลือกประเภทที่ตรงกับคุณ" },
  {
    number: 2,
    title: "ข้อมูลผู้สมัคร",
    description: "ข้อมูลติดต่อและเอกสาร",
    subSteps: personalInfoSubSteps,
  },
  { number: 3, title: "ความยินยอม PDPA", description: "นโยบายคุ้มครองข้อมูล" },
  { number: 4, title: "ยืนยันและส่งใบสมัคร", description: "ตรวจสอบและยืนยัน OTP" },
];

export function RegisterSidebar({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick?: (step: number) => void;
}) {
  return (
    <aside className="bg-background flex w-full shrink-0 flex-col justify-between border-r p-8 md:w-72">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-bold text-white">
            RN
          </span>
          <div>
            <p className="text-sm leading-tight font-semibold">Right Now</p>
            <p className="text-muted-foreground text-xs leading-tight">
              ระบบรับสมัครพนักงานและผู้ให้บริการ
            </p>
          </div>
        </div>

        <ol className="mt-10 space-y-6">
          {steps.map((step) => {
            const isActive = step.number === currentStep;
            const isExpanded = isActive && !!step.subSteps;
            const doneCount = step.subSteps?.filter((sub) => sub.done).length ?? 0;

            return (
              <li key={step.number}>
                <button
                  type="button"
                  onClick={() => onStepClick?.(step.number)}
                  disabled={!onStepClick}
                  className="flex w-full items-start gap-3 text-left disabled:cursor-default"
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      isActive ? "bg-neutral-950 text-white" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {step.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isActive ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {step.title}
                      </p>
                      {isExpanded && (
                        <span className="bg-muted text-muted-foreground shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium">
                          {doneCount}/{step.subSteps!.length}
                        </span>
                      )}
                    </div>
                    {!isExpanded && (
                      <p className="text-muted-foreground text-xs">{step.description}</p>
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <ul className="mt-3 ml-3.5 space-y-2 border-l pl-6">
                    {step.subSteps!.map((sub) => (
                      <li key={sub.id} className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-full",
                            sub.done ? "bg-neutral-950 text-white" : "border-border border",
                          )}
                        >
                          {sub.done && <CheckIcon className="size-2.5" />}
                        </span>
                        <span
                          className={cn(
                            "text-xs",
                            sub.done ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {sub.id} {sub.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <p className="text-muted-foreground text-xs">
        ข้อมูลของคุณได้รับความคุ้มครองตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
      </p>
    </aside>
  );
}
