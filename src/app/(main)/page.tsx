import { EditorialBlogSection } from "./_components/editorial-blog-section";

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col items-center overflow-x-hidden bg-zinc-50 font-sans dark:bg-black">
      <EditorialBlogSection />
    </div>
  );
}
