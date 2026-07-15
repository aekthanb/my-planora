"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ListTodo,
  Menu,
  Network,
  Plus,
  Search,
  UserRound,
  Users,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrSelectionDialog } from "@/components/PrSelectionPanel";
import { cn } from "@/lib/utils";

type DropdownItem = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  href?: string;
  action?: "view-plans" | "create-plan";
};

const employeeItems: DropdownItem[] = [
  {
    icon: Network,
    title: "โครงสร้างองค์กร",
    description: "ดูและจัดการผังโครงสร้างองค์กร",
    href: "/employees/structure",
  },
  {
    icon: Users,
    title: "พนักงานทั้งหมด",
    description: "ดูและจัดการข้อมูลพนักงาน",
    href: "#",
  },
];

const planItems: DropdownItem[] = [
  {
    icon: ListTodo,
    title: "ดูแผนงาน",
    description: "ดูและจัดการแผนงานทั้งหมด",
    action: "view-plans",
  },
  {
    icon: Plus,
    title: "สร้างแผนงานใหม่",
    description: "เริ่มสร้างแผนงานใหม่",
    action: "create-plan",
  },
];

const planTemplates = [
  {
    name: "แผนพัฒนาระบบบริหารบุคลากร",
    type: "พัฒนาระบบ",
    owner: "ทีมผลิตภัณฑ์",
    department: "เทคโนโลยี",
    startDate: "1 ก.ค. 2569",
    endDate: "30 ก.ย. 2569",
  },
  {
    name: "แผนอบรมพนักงานประจำปี",
    type: "พัฒนาบุคลากร",
    owner: "ฝ่ายทรัพยากรบุคคล",
    department: "ทรัพยากรบุคคล",
    startDate: "15 ส.ค. 2569",
    endDate: "15 ต.ค. 2569",
  },
  {
    name: "แผนปรับปรุงกระบวนการทำงาน",
    type: "ปรับปรุงองค์กร",
    owner: "ทีมปฏิบัติการ",
    department: "ปฏิบัติการ",
    startDate: "1 เม.ย. 2569",
    endDate: "30 มิ.ย. 2569",
  },
];

const planStatuses = ["กำลังดำเนินการ", "รอดำเนินการ", "เสร็จสิ้น"];

const plans = Array.from({ length: 100 }, (_, index) => {
  const template = planTemplates[index % planTemplates.length]!;
  const sequence = index + 1;

  return {
    ...template,
    code: `PLN-${String(sequence).padStart(3, "0")}`,
    name: `${template.name} ${sequence}`,
    progress: index % 3 === 2 ? 100 : (index * 17 + 20) % 91,
    budget: `฿${(95000 + ((index * 37500) % 500000)).toLocaleString("en-US")}`,
    status: planStatuses[index % planStatuses.length]!,
  };
});

const navLinks: {
  label: string;
  href: string;
  dropdownLabel?: string;
  dropdown?: DropdownItem[];
  columns?: 1 | 2;
}[] = [
  { label: "พนักงาน", href: "#", dropdown: employeeItems, columns: 2 },
  { label: "แผนงาน", href: "/plans", dropdown: planItems, columns: 2 },
  { label: "ตั้งค่าหลัก", href: "#" },
  { label: "สิทธิ์การใช้งาน", href: "#" },
  { label: "รายงาน", href: "#" },
];

export function Navbar() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [prModalOpen, setPrModalOpen] = useState(false);
  const [planSearch, setPlanSearch] = useState("");
  const [planPage, setPlanPage] = useState(1);
  const navRef = useRef<HTMLElement>(null);

  const plansPerPage = 10;
  const normalizedSearch = planSearch.trim().toLocaleLowerCase("th");
  const filteredPlans = normalizedSearch
    ? plans.filter((plan) =>
        Object.values(plan).some((value) =>
          String(value).toLocaleLowerCase("th").includes(normalizedSearch),
        ),
      )
    : plans;
  const totalPlanPages = Math.max(1, Math.ceil(filteredPlans.length / plansPerPage));
  const paginatedPlans = filteredPlans.slice(
    (planPage - 1) * plansPerPage,
    planPage * plansPerPage,
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function openPlanModal() {
    setOpenMenu(null);
    setMobileOpen(false);
    setPlanModalOpen(true);
  }

  function openPrModal() {
    setOpenMenu(null);
    setMobileOpen(false);
    setPrModalOpen(true);
  }

  function handleDropdownAction(action: NonNullable<DropdownItem["action"]>) {
    if (action === "view-plans") {
      openPlanModal();
    } else {
      openPrModal();
    }
  }

  return (
    <>
      <header ref={navRef} className="bg-background sticky top-0 z-50 w-full">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
              P
            </span>
            <span className="text-base font-medium">Planora</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setOpenMenu(link.label)}
                onMouseLeave={() =>
                  link.dropdown && setOpenMenu((prev) => (prev === link.label ? null : prev))
                }
              >
                {link.dropdown ? (
                  <button
                    type="button"
                    aria-expanded={openMenu === link.label}
                    onClick={() => setOpenMenu((prev) => (prev === link.label ? null : link.label))}
                    className={cn(
                      "hover:bg-muted aria-expanded:bg-muted inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-base leading-none transition-colors",
                      openMenu === link.label
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        openMenu === link.label && "rotate-180",
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center rounded-lg px-4 py-2.5 text-base leading-none transition-colors"
                  >
                    {link.label}
                  </Link>
                )}

                {link.dropdown && openMenu === link.label && (
                  <div className="absolute top-full left-0 w-100 pt-4">
                    <div className="bg-background rounded-xl border p-3 shadow-md">
                      {link.dropdownLabel && (
                        <p className="text-muted-foreground border-b px-2 pb-2 text-xs">
                          {link.dropdownLabel}
                        </p>
                      )}
                      <div
                        className={cn(
                          "grid gap-1",
                          link.dropdownLabel && "mt-2",
                          link.columns === 1 ? "grid-cols-1" : "grid-cols-2",
                        )}
                      >
                        {link.dropdown.map((item) => {
                          const action = item.action;
                          const content = (
                            <>
                              <span className="bg-muted group-hover:bg-background flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors">
                                <item.icon className="size-4" />
                              </span>
                              <span>
                                <span className="flex items-center gap-1 text-sm font-medium">
                                  {item.title}
                                  <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                                </span>
                                {item.description && (
                                  <span className="text-muted-foreground block text-xs">
                                    {item.description}
                                  </span>
                                )}
                              </span>
                            </>
                          );

                          return action ? (
                            <button
                              key={item.title}
                              type="button"
                              onClick={() => handleDropdownAction(action)}
                              className="group hover:bg-muted flex items-start gap-2.5 rounded-lg p-2 text-left transition-colors"
                            >
                              {content}
                            </button>
                          ) : (
                            <Link
                              key={item.title}
                              href={item.href ?? "#"}
                              onClick={() => setOpenMenu(null)}
                              className="group hover:bg-muted flex items-start gap-2.5 rounded-lg p-2 transition-colors"
                            >
                              {content}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Link
            href="/login"
            aria-label="โปรไฟล์"
            className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white transition-opacity hover:opacity-80 md:flex"
          >
            <UserRound className="size-4.5" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="สลับเมนู"
            aria-expanded={mobileOpen}
            className="flex size-8 items-center justify-center md:hidden"
          >
            {mobileOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="space-y-1 border-t px-8 py-4 md:hidden">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label}>
                  <p className="text-foreground py-2 text-sm font-medium">{link.label}</p>
                  <div className="border-l pl-4">
                    {link.dropdown.map((item) => {
                      const action = item.action;

                      return action ? (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => handleDropdownAction(action)}
                          className="text-muted-foreground hover:text-foreground flex w-full items-center gap-2 py-2 text-left text-sm transition-colors"
                        >
                          <item.icon className="size-4" />
                          {item.title}
                        </button>
                      ) : (
                        <Link
                          key={item.title}
                          href={item.href ?? "#"}
                          onClick={() => setMobileOpen(false)}
                          className="text-muted-foreground hover:text-foreground flex items-center gap-2 py-2 text-sm transition-colors"
                        >
                          <item.icon className="size-4" />
                          {item.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-muted-foreground hover:text-foreground block py-2 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ),
            )}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-muted-foreground hover:text-foreground mt-1 flex items-center gap-2 py-2 text-sm transition-colors"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white">
                <UserRound className="size-4" />
              </span>
              โปรไฟล์
            </Link>
          </div>
        )}
      </header>

      <Dialog open={planModalOpen} onOpenChange={setPlanModalOpen}>
        <DialogContent
          initialFocus={false}
          className="bg-popover data-open:slide-in-from-left-8 data-open:zoom-in-100 data-closed:slide-out-to-left-8 data-closed:zoom-out-100 flex max-h-[min(88vh,900px)] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-xl p-0 shadow-2xl duration-300 sm:max-w-352 [[data-slot=dialog-overlay]:has(~_&)]:duration-300"
        >
          <div className="border-border flex shrink-0 items-center justify-between border-b px-6 py-4">
            <DialogHeader className="gap-1">
              <DialogTitle className="text-foreground text-lg font-semibold">
                ทะเบียนแผนงาน
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                รายการแผนงานและผลการดำเนินงานขององค์กร
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="shrink-0 px-6 py-3">
            <label className="relative block w-full max-w-md">
              <span className="sr-only">ค้นหาแผนงาน</span>
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                type="search"
                value={planSearch}
                onChange={(event) => {
                  setPlanSearch(event.target.value);
                  setPlanPage(1);
                }}
                placeholder="ค้นหารหัส ชื่อแผนงาน ผู้รับผิดชอบ หรือสถานะ..."
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border pr-3 pl-9 text-sm transition outline-none focus-visible:ring-2"
              />
            </label>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4">
            <table className="w-full table-fixed text-left text-[13px]">
              <colgroup>
                <col className="w-[8%]" />
                <col className="w-[20%]" />
                <col className="w-[11%]" />
                <col className="w-[13%]" />
                <col className="w-[11%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[9%]" />
                <col className="w-[8%]" />
              </colgroup>
              <thead className="bg-muted sticky top-0 z-10">
                <tr className="border-border text-muted-foreground border-b">
                  <th className="px-3 py-3 font-semibold">รหัส</th>
                  <th className="px-3 py-3 font-semibold">ชื่อแผนงาน</th>
                  <th className="px-3 py-3 font-semibold">ประเภท</th>
                  <th className="px-3 py-3 font-semibold">ผู้รับผิดชอบ</th>
                  <th className="px-3 py-3 font-semibold">ฝ่าย</th>
                  <th className="px-3 py-3 font-semibold">วันเริ่ม</th>
                  <th className="px-3 py-3 font-semibold">วันสิ้นสุด</th>
                  <th className="px-3 py-3 font-semibold">งบประมาณ</th>
                  <th className="px-3 py-3 font-semibold">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPlans.map((plan) => (
                  <tr
                    key={plan.code}
                    tabIndex={0}
                    role="link"
                    onClick={() => {
                      setPlanModalOpen(false);
                      router.push(`/plans/new?project=${encodeURIComponent(plan.code)}`);
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      setPlanModalOpen(false);
                      router.push(`/plans/new?project=${encodeURIComponent(plan.code)}`);
                    }}
                    className="border-border hover:bg-muted focus-visible:ring-ring h-[34px] cursor-pointer border-b transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset"
                  >
                    <td className="text-muted-foreground px-3 py-2 font-mono font-medium">
                      {plan.code}
                    </td>
                    <td className="text-foreground px-3 py-2 font-medium">{plan.name}</td>
                    <td className="text-muted-foreground px-3 py-2">{plan.type}</td>
                    <td className="text-muted-foreground px-3 py-2">{plan.owner}</td>
                    <td className="text-muted-foreground px-3 py-2">{plan.department}</td>
                    <td className="text-muted-foreground px-3 py-2">{plan.startDate}</td>
                    <td className="text-muted-foreground px-3 py-2">{plan.endDate}</td>
                    <td className="text-foreground px-3 py-2 font-medium tabular-nums">
                      {plan.budget}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
                          plan.status === "เสร็จสิ้น"
                            ? "bg-primary text-primary-foreground"
                            : plan.status === "กำลังดำเนินการ"
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-accent text-accent-foreground",
                        )}
                      >
                        {plan.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {paginatedPlans.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-muted-foreground px-4 py-16 text-center text-sm"
                    >
                      ไม่พบแผนงานที่ตรงกับคำค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-border bg-background flex shrink-0 items-center justify-between border-t px-6 py-3">
            <p className="text-muted-foreground text-xs">
              แสดง{" "}
              <span className="text-foreground font-medium">
                {filteredPlans.length === 0 ? 0 : (planPage - 1) * plansPerPage + 1}–
                {Math.min(planPage * plansPerPage, filteredPlans.length)}
              </span>{" "}
              จาก {filteredPlans.length} รายการ
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPlanPage((page) => Math.max(1, page - 1))}
                disabled={planPage === 1}
                aria-label="หน้าก่อนหน้า"
                className="border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground flex size-8 items-center justify-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="size-3.5" />
              </button>
              {Array.from({ length: totalPlanPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setPlanPage(page)}
                  aria-label={`หน้า ${page}`}
                  aria-current={planPage === page ? "page" : undefined}
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground aria-current:bg-primary aria-current:text-primary-foreground flex size-8 items-center justify-center rounded-md text-xs font-medium transition"
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPlanPage((page) => Math.min(totalPlanPages, page + 1))}
                disabled={planPage === totalPlanPages}
                aria-label="หน้าถัดไป"
                className="border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground flex size-8 items-center justify-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PrSelectionDialog open={prModalOpen} onOpenChange={setPrModalOpen} />
    </>
  );
}
