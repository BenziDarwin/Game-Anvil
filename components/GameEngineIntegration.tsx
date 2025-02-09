import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, Coins, ShieldCheck, Gamepad } from "lucide-react";
import Image from "next/image";

const enginePlugins = [
  {
    name: "Unity",
    logo: "/images/unity.png",
    description: "Seamlessly integrate NFTs into Unity-based games",
  },
  {
    name: "Unreal Engine",
    logo: "/images/unreal.png",
    description: "Empower Unreal Engine games with blockchain capabilities",
  },
];

const benefits = [
  {
    title: "Easy Integration",
    description: "Simple plugins for popular game engines",
    icon: Code2,
  },
  {
    title: "True Ownership",
    description: "Players own their in-game assets as NFTs",
    icon: Coins,
  },
  {
    title: "Secure Transactions",
    description: "Blockchain-backed security for all trades",
    icon: ShieldCheck,
  },
  {
    title: "Cross-Game Assets",
    description: "Use items across multiple supported games",
    icon: Gamepad,
  },
];

export default function GameEngineIntegration() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Empowering Game Developers
      </h2>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {enginePlugins.map((engine) => (
          <Card key={engine.name} className="flex items-center p-6">
            <Image
              src={engine.logo || "/placeholder.svg"}
              alt={`${engine.name} logo`}
              width={80}
              height={80}
              className="mr-6"
            />
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {engine.name} Plugin
              </h3>
              <p className="text-muted-foreground mb-4">{engine.description}</p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                {engine.name === "Unreal Engine" ? "Coming Soon" : "Learn More"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-8 mb-12">
        <h3 className="text-2xl font-bold mb-6 text-center">
          Financial Immersion & Ownership in Gaming
        </h3>
        <p className="text-lg mb-6 text-center max-w-3xl mx-auto">
          Our platform aims to revolutionize gaming by introducing true
          financial immersion and asset ownership. Players can now have real
          stakes in their virtual worlds, creating a more engaging and rewarding
          gaming experience.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="bg-white dark:bg-gray-800">
              <CardContent className="p-4 text-center">
                <benefit.icon className="h-8 w-8 mx-auto mb-4 text-orange-500" />
                <h4 className="font-semibold mb-2">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
