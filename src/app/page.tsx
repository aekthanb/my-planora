import { Navbar } from "./_components/navbar";
import { NewsInsightSection } from "./_components/news-insight-section";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      <NewsInsightSection />
    </div>
  );
}
