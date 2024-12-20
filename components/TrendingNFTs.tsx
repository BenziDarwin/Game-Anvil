"use client";

import { Card } from "@/components/ui/card";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const trendingNFTs = [
  {
    id: 1,
    title: "Cosmic Dreamer #123",
    creator: "CryptoArtist",
    price: "2.5 ETH",
    image:
      "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=500&h=500&fit=crop",
    likes: 234,
  },
  {
    id: 2,
    title: "Digital Genesis #045",
    creator: "NFTMaster",
    price: "1.8 ETH",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=500&fit=crop",
    likes: 189,
  },
  {
    id: 3,
    title: "Abstract Reality #678",
    creator: "DigitalDreams",
    price: "3.2 ETH",
    image:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&h=500&fit=crop",
    likes: 342,
  },
];

export default function TrendingNFTs() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>,
    id: number,
  ) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    setHoveredCard(null);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Trending NFTs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trendingNFTs.map((nft) => (
          <Card
            key={nft.id}
            className="overflow-hidden transition-all duration-300 ease-out"
            style={{
              transformStyle: "preserve-3d",
              transform: hoveredCard === nft.id ? "translateZ(20px)" : "none",
            }}
            onMouseEnter={() => setHoveredCard(nft.id)}
            onMouseMove={(e) => handleMouseMove(e, nft.id)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative aspect-square">
              <Image
                src={nft.image}
                alt={nft.title}
                fill
                className="object-cover cursor-pointer"
                onClick={() => router.push("/nft/1")}
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{nft.title}</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">by {nft.creator}</p>
              <div className="flex justify-between items-center">
                <span className="text-orange-500 font-semibold">
                  {nft.price}
                </span>
                <span className="text-sm text-gray-500">{nft.likes} likes</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
