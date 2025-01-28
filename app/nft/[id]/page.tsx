"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDocumentById } from "@/firebase/firestore";
import { NFT } from "@/lib/types";
import { toast } from "sonner";

export default function NFTPage() {
  const params = useParams();
  const [nft, setNft] = useState<NFT | null>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNFT = async () => {
    try {
      let data: NFT | null = await getDocumentById("nfts", params.id as string);
      setNft(data);
    } catch (e) {
      toast.error("Unknown error occured");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFT();
  }, []);

  if (loading) return <div>loading...</div>;

  if (nft) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div className="relative aspect-square">
              <Card className="overflow-hidden">
                <Image
                  src={nft.image}
                  alt={nft.title}
                  fill
                  className="object-cover"
                />
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{nft.title}</h1>
                  <Link
                    href={`/profile/${nft.creator}`}
                    className="text-orange-500 hover:underline"
                  >
                    Created by {nft.creator}
                  </Link>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge className="bg-orange-500">{nft.category}</Badge>
                </div>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Current Price</h3>
                  <p className="text-3xl font-bold text-orange-500">
                    {nft.price} ETH
                  </p>
                  <div className="mt-4 space-x-4">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Buy Now
                    </Button>
                    <Button variant="outline">Make Offer</Button>
                  </div>
                </Card>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{nft.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } else {
    return <div>Nft not found</div>;
  }
}
