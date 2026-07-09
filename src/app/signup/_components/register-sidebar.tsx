import { cn } from "@/lib/utils";

const steps = [
  { number: 1, title: "ประเภทผู้สมัคร", description: "เลือกประเภทที่ตรงกับคุณ" },
  { number: 2, title: "ข้อมูลส่วนบุคคล", description: "ข้อมูลติดต่อและเอกสาร" },
  { number: 3, title: "ความยินยอม PDPA", description: "นโยบายคุ้มครองข้อมูล" },
  { number: 4, title: "ยืนยันและส่งใบสมัคร", description: "ตรวจสอบและยืนยัน OTP" },
];

export function RegisterSidebar({ currentStep }: { currentStep: number }) {
  return (
    <aside className="bg-background flex w-full shrink-0 flex-col justify-between border-r p-8 md:w-72">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-950 text-sm font-bold text-white">
            <span className="absolute -top-3 -right-3 size-6 rounded-full bg-linear-to-br from-orange-500 via-rose-500 to-transparent opacity-70 blur-md" />
            <span className="absolute -bottom-3 -left-3 size-6 rounded-full bg-linear-to-tr from-indigo-600 via-blue-500 to-transparent opacity-60 blur-md" />
            <span className="relative">RN</span>
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
            return (
              <li key={step.number} className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    isActive ? "bg-neutral-950 text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  {step.number}
                </span>
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-muted-foreground text-xs">{step.description}</p>
                </div>
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
