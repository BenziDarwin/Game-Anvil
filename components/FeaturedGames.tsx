import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const games = [
  {
    name: "Crypto Legends",
    description: "A blockchain-based RPG with tradeable heroes and items",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    name: "NFT Racer",
    description: "High-octane racing game with customizable NFT vehicles",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    name: "Decentraland",
    description: "Virtual world where players own and create experiences",
    image: "/placeholder.svg?height=200&width=400",
  },
];

export default function FeaturedGames() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Featured Games</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {games.map((game) => (
          <Card key={game.name} className="overflow-hidden">
            <Image
              src={game.image || "/placeholder.svg"}
              alt={game.name}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
              <p className="text-muted-foreground mb-4">{game.description}</p>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Learn More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
