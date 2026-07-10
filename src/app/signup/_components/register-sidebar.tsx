import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const personalInfoSubSteps = [
  { id: 1, label: "ข้อมูลส่วนตัว" },
  { id: 2, label: "ที่อยู่ทะเบียนบ้าน" },
  { id: 3, label: "ที่อยู่ปัจจุบัน" },
  { id: 4, label: "ครอบครัว" },
  { id: 5, label: "ติดต่อฉุกเฉิน" },
  { id: 6, label: "สถานะสมรส" },
  { id: 7, label: "สถานภาพทางทหาร" },
  { id: 8, label: "การศึกษา" },
  { id: 9, label: "การทำงาน" },
  { id: 10, label: "สุขภาพ" },
  { id: 11, label: "ฝึกอบรม" },
  { id: 12, label: "ภาษา" },
  { id: 13, label: "ข้อมูลเพิ่มเติม" },
  { id: 14, label: "เอกสารแนบ" },
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
  subStepCompletion,
}: {
  currentStep: number;
  onStepClick?: (step: number) => void;
  subStepCompletion?: Record<number, boolean>;
}) {
  return (
    <aside className="bg-background sticky top-0 flex h-svh w-full shrink-0 flex-col justify-between overflow-y-auto border-r p-8 md:w-72">
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
            const subSteps = step.subSteps?.map((sub) => ({
              ...sub,
              done: subStepCompletion?.[sub.id] ?? false,
            }));
            const doneCount = subSteps?.filter((sub) => sub.done).length ?? 0;

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
                          {doneCount}/{subSteps!.length}
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
                    {subSteps!.map((sub) => (
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
