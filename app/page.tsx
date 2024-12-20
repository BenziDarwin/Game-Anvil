import Categories from "@/components/Categories";
import Hero from "@/components/Hero";
import TrendingNFTs from "@/components/TrendingNFTs";
import TopCollectors from "@/components/TopCollectors";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <TrendingNFTs />
      <Categories />
      <TopCollectors />
    </main>
  );
}
