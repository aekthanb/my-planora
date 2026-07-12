"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
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
import { cn } from "@/lib/utils";

type DropdownItem = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  href?: string;
  action?: "view-plans";
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
    href: "/plans/new",
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
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
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

  useEffect(() => {
    if (!planModalOpen) return;

    const previousOverflow = document.documentElement.style.overflow;
    const previousScrollbarGutter = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.scrollbarGutter = "auto";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setPlanModalOpen(false);
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.documentElement.style.overflow = previousOverflow;
      document.documentElement.style.scrollbarGutter = previousScrollbarGutter;
    };
  }, [planModalOpen]);

  function openPlanModal() {
    setOpenMenu(null);
    setMobileOpen(false);
    setPlanModalOpen(true);
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

                          return item.action === "view-plans" ? (
                            <button
                              key={item.title}
                              type="button"
                              onClick={openPlanModal}
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
                    {link.dropdown.map((item) =>
                      item.action === "view-plans" ? (
                        <button
                          key={item.title}
                          type="button"
                          onClick={openPlanModal}
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
                      ),
                    )}
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

      {planModalOpen && (
        <div
          className="fixed inset-0 z-100 flex w-screen items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPlanModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-modal-title"
            className="bg-background flex h-[min(88vh,900px)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-slate-300 shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 id="plan-modal-title" className="text-lg font-semibold text-slate-950">
                  ทะเบียนแผนงาน
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  รายการแผนงานและผลการดำเนินงานขององค์กร
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPlanModalOpen(false)}
                aria-label="ปิดหน้าต่างแผนงาน"
                className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="shrink-0 border-b border-slate-200 px-6 py-3">
              <label className="relative block w-full max-w-md">
                <span className="sr-only">ค้นหาแผนงาน</span>
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={planSearch}
                  onChange={(event) => {
                    setPlanSearch(event.target.value);
                    setPlanPage(1);
                  }}
                  placeholder="ค้นหารหัส ชื่อแผนงาน ผู้รับผิดชอบ หรือสถานะ..."
                  className="h-9 w-full rounded-md border border-slate-300 bg-white pr-3 pl-9 text-sm text-slate-900 transition outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </label>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4">
              <table className="w-full table-fixed text-left text-xs xl:text-sm">
                <colgroup>
                  <col className="w-[7%]" />
                  <col className="w-[18%]" />
                  <col className="w-[10%]" />
                  <col className="w-[12%]" />
                  <col className="w-[10%]" />
                  <col className="w-[9%]" />
                  <col className="w-[9%]" />
                  <col className="w-[9%]" />
                  <col className="w-[8%]" />
                  <col className="w-[8%]" />
                </colgroup>
                <thead className="sticky top-0 z-10 bg-slate-100">
                  <tr className="border-b border-slate-300 text-slate-600">
                    <th className="px-2 py-3 font-semibold">รหัส</th>
                    <th className="px-2 py-3 font-semibold">ชื่อแผนงาน</th>
                    <th className="px-2 py-3 font-semibold">ประเภท</th>
                    <th className="px-2 py-3 font-semibold">ผู้รับผิดชอบ</th>
                    <th className="px-2 py-3 font-semibold">ฝ่าย</th>
                    <th className="px-2 py-3 font-semibold">วันเริ่ม</th>
                    <th className="px-2 py-3 font-semibold">วันสิ้นสุด</th>
                    <th className="px-2 py-3 font-semibold">ความคืบหน้า</th>
                    <th className="px-2 py-3 font-semibold">งบประมาณ</th>
                    <th className="px-2 py-3 font-semibold">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPlans.map((plan) => (
                    <tr
                      key={plan.code}
                      className="border-b border-slate-200 even:bg-slate-50/70 hover:bg-blue-50/60"
                    >
                      <td className="px-2 py-3 font-mono text-[11px] font-medium text-slate-500">
                        {plan.code}
                      </td>
                      <td className="px-2 py-3 font-medium text-slate-900">{plan.name}</td>
                      <td className="px-2 py-3 text-slate-600">{plan.type}</td>
                      <td className="px-2 py-3 text-slate-600">{plan.owner}</td>
                      <td className="px-2 py-3 text-slate-600">{plan.department}</td>
                      <td className="px-2 py-3 text-slate-600">{plan.startDate}</td>
                      <td className="px-2 py-3 text-slate-600">{plan.endDate}</td>
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 min-w-6 flex-1 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-slate-700"
                              style={{ width: `${plan.progress}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-slate-500 tabular-nums">
                            {plan.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3 font-medium text-slate-700 tabular-nums">
                        {plan.budget}
                      </td>
                      <td className="px-2 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-md px-2 py-1 text-[11px] font-medium whitespace-nowrap shadow-xs",
                            plan.status === "เสร็จสิ้น"
                              ? "bg-emerald-700 text-white"
                              : plan.status === "กำลังดำเนินการ"
                                ? "bg-blue-700 text-white"
                                : "bg-amber-600 text-white",
                          )}
                        >
                          {plan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {paginatedPlans.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-16 text-center text-sm text-slate-500">
                        ไม่พบแผนงานที่ตรงกับคำค้นหา
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-6 py-3">
              <p className="text-xs text-slate-500">
                แสดง{" "}
                <span className="font-medium text-slate-700">
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
                  className="flex size-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
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
                    className="flex size-8 items-center justify-center rounded-md text-xs font-medium text-slate-600 transition hover:bg-slate-100 aria-current:bg-slate-900 aria-current:text-white"
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPlanPage((page) => Math.min(totalPlanPages, page + 1))}
                  disabled={planPage === totalPlanPages}
                  aria-label="หน้าถัดไป"
                  className="flex size-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
