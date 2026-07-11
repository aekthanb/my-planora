"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ListTodo,
  Menu,
  Network,
  Plus,
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

const plans = [
  {
    name: "แผนพัฒนาระบบบริหารบุคลากร",
    owner: "ทีมผลิตภัณฑ์",
    period: "1 ก.ค. – 30 ก.ย. 2569",
    status: "กำลังดำเนินการ",
  },
  {
    name: "แผนอบรมพนักงานประจำปี",
    owner: "ฝ่ายทรัพยากรบุคคล",
    period: "15 ส.ค. – 15 ต.ค. 2569",
    status: "รอดำเนินการ",
  },
  {
    name: "แผนปรับปรุงกระบวนการทำงาน",
    owner: "ทีมปฏิบัติการ",
    period: "1 เม.ย. – 30 มิ.ย. 2569",
    status: "เสร็จสิ้น",
  },
];

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
  const navRef = useRef<HTMLElement>(null);

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

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setPlanModalOpen(false);
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
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
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPlanModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-modal-title"
            className="bg-background w-full max-w-5xl overflow-hidden rounded-2xl border shadow-2xl"
          >
            <div className="flex items-start justify-between border-b px-6 py-5">
              <div>
                <h2 id="plan-modal-title" className="text-xl font-semibold">
                  แผนงานทั้งหมด
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  รายการแผนงานและสถานะการดำเนินงาน
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPlanModalOpen(false)}
                aria-label="ปิดหน้าต่างแผนงาน"
                className="hover:bg-muted flex size-9 items-center justify-center rounded-full transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto p-6">
              <table className="w-full min-w-180 text-left text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b">
                    <th className="px-4 py-3 font-medium">ชื่อแผนงาน</th>
                    <th className="px-4 py-3 font-medium">ผู้รับผิดชอบ</th>
                    <th className="px-4 py-3 font-medium">ระยะเวลา</th>
                    <th className="px-4 py-3 font-medium">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.name} className="hover:bg-muted/50 border-b last:border-0">
                      <td className="px-4 py-4 font-medium">{plan.name}</td>
                      <td className="text-muted-foreground px-4 py-4">{plan.owner}</td>
                      <td className="text-muted-foreground px-4 py-4 whitespace-nowrap">
                        {plan.period}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
                            plan.status === "เสร็จสิ้น"
                              ? "bg-emerald-100 text-emerald-700"
                              : plan.status === "กำลังดำเนินการ"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700",
                          )}
                        >
                          {plan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
