import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh md:grid-cols-2">
      <div className="relative hidden flex-col justify-end overflow-hidden bg-neutral-950 p-10 text-neutral-50 md:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-16 size-104 rounded-full bg-linear-to-br from-orange-500 via-rose-500 to-transparent opacity-60 blur-3xl" />
          <div className="absolute top-1/3 -left-24 size-88 rounded-full bg-linear-to-tr from-indigo-600 via-blue-500 to-transparent opacity-50 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 size-80 rounded-full bg-linear-to-t from-purple-600 via-fuchsia-500 to-transparent opacity-40 blur-3xl" />
        </div>

        <span className="relative z-10 flex size-9 items-center justify-center rounded-full bg-white text-sm font-bold text-neutral-950">
          P
        </span>

        <h2 className="relative z-10 mt-6 max-w-xs text-3xl leading-tight font-semibold text-balance">
          ยินดีต้อนรับกลับสู่พื้นที่ทำงานของคุณ
        </h2>

        <p className="relative z-10 mt-8 text-xs text-neutral-500">
          © {new Date().getFullYear()} Planora. สงวนลิขสิทธิ์ทั้งหมด
        </p>
      </div>

      <div className="flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2 md:hidden">
            <span className="flex size-8 items-center justify-center rounded-md bg-neutral-950 text-sm font-bold text-white">
              P
            </span>
            <span className="text-sm font-semibold">Planora</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
