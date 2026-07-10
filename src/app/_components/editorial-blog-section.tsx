"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Newspaper } from "lucide-react";

type BlogPost = {
  title: string;
  excerpt: string;
};

const posts: BlogPost[] = [
  {
    title: "แนวคิดการออกแบบระบบบริหารจัดการองค์กร",
    excerpt:
      "เราออกแบบทุกฟีเจอร์ให้ใช้งานง่ายตั้งแต่แรกเห็น พร้อมรองรับการเติบโตของทีมในทุกขนาดองค์กร",
  },
  {
    title: "คู่มือฉบับสมบูรณ์สำหรับการเริ่มต้นใช้งาน Planora",
    excerpt: "ตั้งแต่การตั้งค่าทีมแรก ไปจนถึงการออกรายงานสรุปผลการทำงานแบบเรียลไทม์",
  },
  {
    title: "5 วิธีบริหารเวลาให้ทีมทำงานอย่างมีประสิทธิภาพ",
    excerpt:
      "แนวทางจัดลำดับความสำคัญของงาน ลดการประชุมที่ไม่จำเป็น และสร้างจังหวะการทำงานที่ยั่งยืน",
  },
  {
    title: "วิธีออกแบบผังโครงสร้างองค์กรให้รองรับการเติบโต",
    excerpt: "หลักการจัดชั้นบังคับบัญชาและแบ่งฝ่ายงานที่ช่วยให้องค์กรขยายทีมได้โดยไม่สะดุด",
  },
];

export function EditorialBlogSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  function updateProgress() {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max <= 0 ? 100 : (el.scrollLeft / max) * 100);
  }

  function scrollByPage(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  }

  return (
    <section className="relative w-full flex-1 py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-8 border-l sm:left-16 lg:left-24 xl:left-32"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-8 border-r sm:right-16 lg:right-24 xl:right-32"
      />

      <div className="mx-auto max-w-6xl px-8 py-10 sm:py-14">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <span className="bg-foreground size-1.5 rounded-full" aria-hidden="true" />
              มีอะไรใหม่?
            </p>
            <h2 className="mt-4 text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
              บทความ<span className="text-muted-foreground">.</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed sm:text-right">
            เรื่องราว แนวคิด และอัปเดตความเคลื่อนไหวในการบริหารจัดการองค์กร คัดสรรโดยทีมงาน Planora
          </p>
        </div>
      </div>
      <div className="mx-8 border-t sm:mx-16 lg:mx-24 xl:mx-32" />

      <div
        ref={scrollRef}
        onScroll={updateProgress}
        className="divide-border mx-auto flex max-w-6xl snap-x snap-mandatory scrollbar-none divide-x overflow-x-auto scroll-smooth"
      >
        {posts.map((post) => (
          <Link
            key={post.title}
            href="#"
            className="group flex w-full shrink-0 snap-start sm:w-1/2"
          >
            <div className="flex flex-1 flex-col justify-center gap-4 p-10 sm:p-16">
              <h3 className="group-hover:text-primary text-xl font-semibold transition-colors sm:text-2xl">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>
            </div>
            <div className="from-muted to-muted/40 relative w-1/2 shrink-0 bg-linear-to-br sm:w-[55%]">
              <Newspaper className="text-muted-foreground/20 absolute inset-0 m-auto size-10" />
            </div>
          </Link>
        ))}
      </div>
      <div className="mx-8 border-t sm:mx-16 lg:mx-24 xl:mx-32" />

      <div className="mx-auto flex max-w-6xl items-center gap-6 px-8 py-6 sm:py-8">
        <div className="bg-border relative h-px flex-1 overflow-hidden rounded-full">
          <div
            className="bg-foreground absolute inset-y-0 left-0 transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            aria-label="ก่อนหน้า"
            className="hover:bg-muted flex size-9 items-center justify-center rounded-full border transition-colors"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            aria-label="ถัดไป"
            className="hover:bg-muted flex size-9 items-center justify-center rounded-full border transition-colors"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
