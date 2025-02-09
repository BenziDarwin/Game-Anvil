import { Card, CardContent } from "@/components/ui/card";
import { Zap, Shield, Globe, Coins } from "lucide-react";

const visionPoints = [
  {
    title: "Secure Ownership",
    description:
      "True ownership of your in-game assets through blockchain technology",
    icon: Shield,
  },
  {
    title: "Player-Driven Economy",
    description: "Trade and sell your NFTs in a decentralized marketplace",
    icon: Coins,
  },
  {
    title: "Exclusive Benefits",
    description: "Access special events and features with your NFT holdings",
    icon: Zap,
  },
  {
    title: "Tokenized In-Game Currency",
    description:
      "Earn and spend blockchain-backed tokens for in-game transactions",
    icon: Coins,
  },
  {
    title: "Dedicated Blockchain Network",
    description:
      "A custom blockchain to manage game assets efficiently and securely",
    icon: Globe,
  },
];

export default function FutureVision() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Future Vision</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {visionPoints.map((point, index) => (
          <Card key={point.title} className="overflow-hidden">
            <CardContent className="p-6 flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <point.icon className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                <p className="text-muted-foreground">{point.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
