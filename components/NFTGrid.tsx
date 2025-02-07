"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { auth } from "@/firebase/config";
import { getCollection } from "@/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { NFT } from "@/lib/types";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";

interface NFTGridProps {
  category: string;
  uid?: string;
}

export default function NFTGrid({ category, uid }: NFTGridProps) {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [nfts, setNFTS] = useState<NFT[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

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

  const fetchCollection = async () => {
    setLoading(true);
    try {
      if (category === "created") {
        let data: NFT[] = await getCollection("nfts", [
          {
            field: "creator",
            operator: "==",
            value: auth.currentUser!?.uid || uid,
          },
        ]);
        setNFTS(data);
        setFilteredNfts(data);
      } else if (category === "collected") {
        let data: NFT[] = await getCollection("nfts", [
          {
            field: "owner",
            operator: "==",
            value: auth.currentUser?.uid || uid,
          },
        ]);
        setNFTS(data);
        setFilteredNfts(data);
      } else if (category === "all") {
        let data: NFT[] = await getCollection("nfts");
        setNFTS(data);
        setFilteredNfts(data);
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description: "Unknown error occured.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, []);

  const filterCategory = (category: string) => {
    if (category === "all") {
      setFilteredNfts(nfts);
    } else {
      setFilteredNfts(nfts.filter((nft) => nft.category === category));
    }
  };

  useEffect(() => {
    filterCategory(category);
  }, [category]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredNfts.map((nft, index) => (
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
          onMouseEnter={() => setHoveredCard(nft.id!)}
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
              <span className="text-orange-500 font-semibold">
                {nft.price} ETH
              </span>
              {/* <span className="text-sm text-gray-500">{nft.likes} likes</span> */}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
