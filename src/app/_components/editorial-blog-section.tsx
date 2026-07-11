"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type BlogPost = {
  title: string;
  excerpt: string;
  image: string;
};

const posts: BlogPost[] = [
  {
    title: "แนวคิดการออกแบบระบบบริหารจัดการองค์กร",
    excerpt:
      "เราออกแบบทุกฟีเจอร์ให้ใช้งานง่ายตั้งแต่แรกเห็น พร้อมรองรับการเติบโตของทีมในทุกขนาดองค์กร",
    image: "https://images.pexels.com/photos/10922370/pexels-photo-10922370.jpeg",
  },
  {
    title: "คู่มือฉบับสมบูรณ์สำหรับการเริ่มต้นใช้งาน Planora",
    excerpt: "ตั้งแต่การตั้งค่าทีมแรก ไปจนถึงการออกรายงานสรุปผลการทำงานแบบเรียลไทม์",
    image: "https://images.pexels.com/photos/22711217/pexels-photo-22711217.jpeg",
  },
  {
    title: "5 วิธีบริหารเวลาให้ทีมทำงานอย่างมีประสิทธิภาพ",
    excerpt:
      "แนวทางจัดลำดับความสำคัญของงาน ลดการประชุมที่ไม่จำเป็น และสร้างจังหวะการทำงานที่ยั่งยืน",
    image: "https://images.pexels.com/photos/5466238/pexels-photo-5466238.jpeg",
  },
  {
    title: "วิธีออกแบบผังโครงสร้างองค์กรให้รองรับการเติบโต",
    excerpt: "หลักการจัดชั้นบังคับบัญชาและแบ่งฝ่ายงานที่ช่วยให้องค์กรขยายทีมได้โดยไม่สะดุด",
    image: "https://images.pexels.com/photos/31525131/pexels-photo-31525131.jpeg",
  },
];

const activityPosts: BlogPost[] = [
  {
    title: "เวิร์กช็อปวางแผนการทำงานร่วมกัน",
    excerpt: "เปิดพื้นที่ให้ทุกทีมแลกเปลี่ยนมุมมอง และร่วมกันกำหนดเป้าหมายการทำงานในไตรมาสใหม่",
    image: "https://images.pexels.com/photos/5466238/pexels-photo-5466238.jpeg",
  },
  {
    title: "กิจกรรมแบ่งปันความรู้ประจำเดือน",
    excerpt: "ชวนเพื่อนร่วมทีมมาแบ่งปันประสบการณ์ เทคนิค และแนวคิดใหม่ที่นำไปใช้กับงานได้จริง",
    image: "https://images.pexels.com/photos/31525131/pexels-photo-31525131.jpeg",
  },
  {
    title: "วันพบปะและสร้างความสัมพันธ์ในทีม",
    excerpt: "เติมพลังให้การทำงานด้วยกิจกรรมสบาย ๆ ที่ช่วยให้ทุกคนรู้จักและเข้าใจกันมากขึ้น",
    image: "https://images.pexels.com/photos/10922370/pexels-photo-10922370.jpeg",
  },
  {
    title: "เบื้องหลังทีมงาน Planora",
    excerpt:
      "ทำความรู้จักผู้คนและกระบวนการทำงานเบื้องหลังฟีเจอร์ที่ช่วยให้องค์กรบริหารงานได้ง่ายขึ้น",
    image: "https://images.pexels.com/photos/22711217/pexels-photo-22711217.jpeg",
  },
];

type EditorialCarouselProps = {
  eyebrow: string;
  title: string;
  items: BlogPost[];
};

function EditorialCarousel({ eyebrow, title, items }: EditorialCarouselProps) {
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

      <div className="relative left-1/2 w-screen -translate-x-1/2 border-t" />

      <div className="mx-auto max-w-6xl px-8 py-10 sm:py-14">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <span className="bg-foreground size-1.5 rounded-full" aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 className="mt-4 text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
              {title}
              <span className="text-muted-foreground">.</span>
            </h2>
          </div>
        </div>
      </div>
      <div className="mx-8 border-t sm:mx-16 lg:mx-24 xl:mx-32" />

      <div
        ref={scrollRef}
        onScroll={updateProgress}
        className="divide-border mx-auto flex max-w-6xl snap-x snap-mandatory scrollbar-none divide-x overflow-x-auto scroll-smooth"
      >
        {items.map((post) => (
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
            <div className="bg-muted relative w-1/2 shrink-0 overflow-hidden sm:w-[55%]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 640px) 30vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
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

function ActivitySection() {
  const featuredActivity = activityPosts[0]!;
  const otherActivities = activityPosts.slice(1);

  return (
    <section className="relative w-full flex-1 pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-8 border-l sm:left-16 lg:left-24 xl:left-32"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-8 border-r sm:right-16 lg:right-24 xl:right-32"
      />

      <div className="border-y">
        <div className="mx-auto max-w-6xl px-8 py-10 sm:py-14">
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <span className="bg-foreground size-1.5 rounded-full" aria-hidden="true" />
            ร่วมสนุกไปด้วยกัน
          </p>
          <div className="mt-4 flex items-end justify-between gap-6">
            <h2 className="text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
              กิจกรรม<span className="text-muted-foreground">.</span>
            </h2>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground hidden items-center gap-2 pb-2 text-sm transition-colors sm:flex"
            >
              ดูกิจกรรมทั้งหมด
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-border mx-auto grid max-w-6xl gap-px md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="#"
          className="group bg-muted relative min-h-96 overflow-hidden md:col-span-2 lg:row-span-3 lg:min-h-150"
        >
          <Image
            src={featuredActivity.image}
            alt={featuredActivity.title}
            fill
            sizes="(min-width: 1024px) 65vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
            <span className="mb-4 inline-flex rounded-full border border-white/40 px-3 py-1 text-xs">
              กิจกรรมแนะนำ
            </span>
            <h3 className="max-w-xl text-2xl font-semibold sm:text-4xl">
              {featuredActivity.title}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">
              {featuredActivity.excerpt}
            </p>
          </div>
        </Link>

        {otherActivities.map((activity) => (
          <Link
            key={activity.title}
            href="#"
            className="group bg-background flex min-h-50 lg:flex-col"
          >
            <div className="bg-muted relative w-2/5 shrink-0 overflow-hidden lg:h-40 lg:w-full">
              <Image
                src={activity.image}
                alt={activity.title}
                fill
                sizes="(min-width: 1024px) 33vw, 40vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center p-6">
              <h3 className="group-hover:text-primary text-lg font-semibold transition-colors">
                {activity.title}
              </h3>
              <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
                {activity.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mx-8 border-t sm:mx-16 lg:mx-24 xl:mx-32" />
    </section>
  );
}

export function EditorialBlogSection() {
  return (
    <>
      <EditorialCarousel eyebrow="มีอะไรใหม่?" title="ข่าวสาร" items={posts} />
      <ActivitySection />
    </>
  );
}
