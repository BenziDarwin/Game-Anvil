import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ShoppingCart, Gamepad } from "lucide-react";

const steps = [
  {
    title: "Connect Wallet",
    description: "Link your crypto wallet to start earning and trading NFTs.",
    icon: Wallet,
  },
  {
    title: "Earn & Collect",
    description: "Play games, complete challenges, and unlock exclusive NFTs.",
    icon: Gamepad,
  },
  {
    title: "Buy & Sell",
    description:
      "Trade your earned NFTs in the marketplace for crypto or other assets.",
    icon: ShoppingCart,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <Card key={step.title} className="text-center">
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
