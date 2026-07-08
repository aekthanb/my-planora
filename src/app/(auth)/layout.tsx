import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckIcon } from "lucide-react";

const features = [
  "ติดตามสถานะงานของทีมแบบเรียลไทม์",
  "จัดการสิทธิ์และบทบาทของสมาชิกทีมได้ทุกที่",
  "วางแผนตารางงานด้วยปฏิทินในตัว",
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh md:grid-cols-[2fr_3fr]">
      <div className="relative hidden flex-col justify-center bg-neutral-950 p-10 text-neutral-50 md:flex">
        <Link href="/" className="absolute top-10 left-10 flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-white text-sm font-bold text-neutral-950">
            P
          </span>
          <span className="text-sm font-semibold">Planora</span>
        </Link>

        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl leading-tight font-semibold text-balance">
              แพลตฟอร์มจัดการโปรเจกต์สำหรับทีมของคุณ
            </h2>
            <p className="text-base text-neutral-400">
              ติดตามความคืบหน้างาน จัดการทีม และวางแผนโปรเจกต์ได้ในที่เดียว
            </p>
          </div>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-base text-neutral-300">
                <CheckIcon className="mt-0.5 size-5 shrink-0 text-neutral-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="absolute bottom-10 left-10 text-xs text-neutral-500">
          © {new Date().getFullYear()} Planora. สงวนลิขสิทธิ์ทั้งหมด
        </p>
      </div>

      <div className="flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
