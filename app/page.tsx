import Categories from "@/components/Categories";
import FutureVision from "@/components/FutureVision";
import GameEngineIntegration from "@/components/GameEngineIntegration";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <GameEngineIntegration />
      <Categories />
      <FutureVision />
    </main>
  );
}
