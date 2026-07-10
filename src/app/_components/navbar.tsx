"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, Network, UserRound, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

type DropdownItem = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
};

const employeeItems: DropdownItem[] = [
  {
    icon: Network,
    title: "โครงสร้างองค์กร",
    description: "ดูและจัดการผังโครงสร้างองค์กร",
  },
  { icon: Users, title: "พนักงานทั้งหมด", description: "ดูและจัดการข้อมูลพนักงาน" },
];

const navLinks: {
  label: string;
  href: string;
  dropdownLabel?: string;
  dropdown?: DropdownItem[];
  columns?: 1 | 2;
}[] = [
  { label: "พนักงาน", href: "#", dropdown: employeeItems, columns: 2 },
  { label: "แผนงาน", href: "#" },
  { label: "ตั้งค่าหลัก", href: "#" },
  { label: "สิทธิ์การใช้งาน", href: "#" },
  { label: "รายงาน", href: "#" },
];

export function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  return (
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
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.title}
                          href="#"
                          onClick={() => setOpenMenu(null)}
                          className="group hover:bg-muted flex items-start gap-2.5 rounded-lg p-2 transition-colors"
                        >
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
                        </Link>
                      ))}
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
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-muted-foreground hover:text-foreground block py-2 text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="text-muted-foreground hover:text-foreground mt-1 flex items-center gap-2 py-2 text-sm transition-colors"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white">
              <UserRound className="size-4" />
            </span>
            Profile
          </Link>
        </div>
      )}
    </header>
  );
}
