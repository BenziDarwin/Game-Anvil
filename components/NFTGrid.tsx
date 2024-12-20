"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NFT } from "@/lib/types";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// Mock data - In a real app, this would come from an API
const nfts: NFT[] = [
  {
    id: 1,
    title: "Dragon Slayer Skin",
    description: "Legendary skin for the Dragon Slayer class",
    creator: "GameMaster",
    creatorId: "1",
    price: "0.5 ETH",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=500&fit=crop",
    likes: 123,
    category: "skins",
    game: "Dragon Quest Online",
    created: "2024-01-15",
  },
  {
    id: 2,
    title: "Dragon Slayer Skin",
    description: "Legendary skin for the Dragon Slayer class",
    creator: "GameMaster",
    creatorId: "1",
    price: "0.5 ETH",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=500&fit=crop",
    likes: 123,
    category: "skins",
    game: "Dragon Quest Online",
    created: "2024-01-15",
  },
  // Add more mock NFTs...
];

interface NFTGridProps {
  category: string;
}

export default function NFTGrid({ category }: NFTGridProps) {
  const filteredNFTs =
    category === "all" ? nfts : nfts.filter((nft) => nft.category === category);

  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 8;
    const rotateY = (centerX - x) / 8;

    requestAnimationFrame(() => {
      card.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        scale3d(1.03, 1.03, 1.03)
      `;
      card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.12)";
    });
  };

  const handleMouseLeave = (index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    requestAnimationFrame(() => {
      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      card.style.boxShadow = "none";
    });

    setHoveredCard(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredNFTs.map((nft, index) => (
        <Card
          key={nft.id}
          ref={(el) => {
            cardRefs.current[index] = el;
          }}
          className="overflow-hidden transition-all duration-200 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.2s ease-out, box-shadow 0.2s ease-out",
          }}
          onMouseEnter={() => setHoveredCard(nft.id)}
          onMouseMove={(e) => handleMouseMove(e, index)}
          onMouseLeave={() => handleMouseLeave(index)}
        >
          <div className="relative aspect-square">
            <Image
              src={nft.image}
              alt={nft.title}
              fill
              className="object-cover cursor-pointer"
              onClick={() => router.push(`/nft/${nft.id}`)}
            />
            <Badge className="absolute top-2 right-2 bg-orange-500">
              {nft.category}
            </Badge>
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
              <span className="text-orange-500 font-semibold">{nft.price}</span>
              <span className="text-sm text-gray-500">{nft.likes} likes</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
