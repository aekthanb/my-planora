import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NewsPost = {
  category: string;
  title: string;
  excerpt?: string;
  date: string;
  readTime: string;
};

const featuredPost: NewsPost = {
  category: "ข่าวสารองค์กร",
  title: "Planora เปิดตัวฟีเจอร์ใหม่ ยกระดับการบริหารจัดการพนักงานทั้งองค์กร",
  excerpt:
    "อัปเดตฟีเจอร์ล่าสุดที่ช่วยให้ทีม HR วางแผนงาน จัดการสิทธิ์การใช้งาน และออกรายงานได้ในที่เดียว พร้อมเครื่องมือบริหารจัดการครบวงจร",
  date: "8 ก.ค. 2569",
  readTime: "5 นาทีในการอ่าน",
};

const sidePosts: NewsPost[] = [
  {
    category: "เคล็ดลับการทำงาน",
    title: "5 วิธีบริหารเวลาให้ทีมทำงานอย่างมีประสิทธิภาพ",
    date: "5 ก.ค. 2569",
    readTime: "3 นาทีในการอ่าน",
  },
  {
    category: "อัปเดตระบบ",
    title: "อัปเดตระบบสิทธิ์การใช้งานเวอร์ชันล่าสุด",
    date: "1 ก.ค. 2569",
    readTime: "2 นาทีในการอ่าน",
  },
];

const gridPosts: NewsPost[] = [
  {
    category: "แนวโน้มธุรกิจ",
    title: "เทรนด์การบริหารทรัพยากรบุคคลที่ต้องจับตาในปี 2569",
    date: "28 มิ.ย. 2569",
    readTime: "4 นาทีในการอ่าน",
  },
  {
    category: "โครงสร้างองค์กร",
    title: "วิธีออกแบบผังโครงสร้างองค์กรให้รองรับการเติบโต",
    date: "22 มิ.ย. 2569",
    readTime: "6 นาทีในการอ่าน",
  },
  {
    category: "การใช้งานระบบ",
    title: "เริ่มต้นใช้งาน Planora สำหรับทีม HR มือใหม่",
    date: "15 มิ.ย. 2569",
    readTime: "3 นาทีในการอ่าน",
  },
];

function PostThumbnail({ category, className }: { category: string; className?: string }) {
  return (
    <div
      className={cn(
        "from-muted to-muted/40 relative flex items-center justify-center overflow-hidden rounded-xl bg-linear-to-br",
        className,
      )}
    >
      <Newspaper className="text-muted-foreground/25 size-10" />
      <span className="bg-background/90 text-foreground absolute top-3 left-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
        {category}
      </span>
    </div>
  );
}

function PostMeta({ post }: { post: NewsPost }) {
  return (
    <div className="text-muted-foreground mt-3 flex items-center gap-2 text-xs">
      <span>{post.date}</span>
      <span aria-hidden="true">•</span>
      <span>{post.readTime}</span>
    </div>
  );
}

function FeaturedCard({ post }: { post: NewsPost }) {
  return (
    <Link href="#" className="group flex flex-col gap-4 lg:col-span-2 lg:row-span-2">
      <PostThumbnail
        category={post.category}
        className="aspect-video lg:aspect-auto lg:h-full lg:min-h-80"
      />
      <div>
        <h3 className="group-hover:text-primary text-xl font-semibold transition-colors sm:text-2xl">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">{post.excerpt}</p>
        )}
        <PostMeta post={post} />
      </div>
    </Link>
  );
}

function SideCard({ post }: { post: NewsPost }) {
  return (
    <Link href="#" className="group flex gap-4">
      <div className="from-muted to-muted/40 flex size-20 shrink-0 items-center justify-center rounded-xl bg-linear-to-br">
        <Newspaper className="text-muted-foreground/25 size-6" />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-muted-foreground text-xs font-medium">{post.category}</p>
        <h4 className="group-hover:text-primary mt-1 line-clamp-2 text-sm font-semibold transition-colors">
          {post.title}
        </h4>
        <span className="text-muted-foreground mt-1.5 text-xs">{post.date}</span>
      </div>
    </Link>
  );
}

function GridCard({ post }: { post: NewsPost }) {
  return (
    <Link href="#" className="group flex flex-col gap-4">
      <PostThumbnail category={post.category} className="aspect-video" />
      <div>
        <h4 className="group-hover:text-primary line-clamp-2 text-base font-semibold transition-colors">
          {post.title}
        </h4>
        <PostMeta post={post} />
      </div>
    </Link>
  );
}

export function NewsInsightSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-8 py-20">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-xl">
          <p className="text-primary text-sm font-medium">ข่าวสารและบทความ</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">ข่าวสารและอินไซต์ล่าสุด</h2>
          <p className="text-muted-foreground mt-3 text-base">
            อัปเดตความเคลื่อนไหว ฟีเจอร์ใหม่ และแนวคิดการบริหารจัดการองค์กรจากทีม Planora
          </p>
        </div>
        <Button
          variant="outline"
          className="shrink-0"
          render={<Link href="#" />}
          nativeButton={false}
        >
          ดูทั้งหมด
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <FeaturedCard post={featuredPost} />
        <div className="flex flex-col gap-8">
          {sidePosts.map((post) => (
            <SideCard key={post.title} post={post} />
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 border-t pt-8 sm:grid-cols-3">
        {gridPosts.map((post) => (
          <GridCard key={post.title} post={post} />
        ))}
      </div>
    </section>
  );
}
