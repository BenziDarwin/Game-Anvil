'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { NFT } from '@/lib/types';

// Mock data - In a real app, this would come from an API
const nfts: NFT[] = [
  {
    id: '1',
    title: 'Dragon Slayer Skin',
    description: 'Legendary skin for the Dragon Slayer class',
    creator: 'GameMaster',
    creatorId: '1',
    price: '0.5 ETH',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=500&fit=crop',
    likes: 123,
    category: 'skins',
    game: 'Dragon Quest Online',
    created: '2024-01-15',
  },
  // Add more mock NFTs...
];

interface NFTGridProps {
  category: string;
}

export default function NFTGrid({ category }: NFTGridProps) {
  const filteredNFTs = category === 'all' 
    ? nfts 
    : nfts.filter(nft => nft.category === category);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredNFTs.map((nft) => (
        <Link href={`/nft/${nft.id}`} key={nft.id}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-square">
              <Image
                src={nft.image}
                alt={nft.title}
                fill
                className="object-cover"
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
        </Link>
      ))}
    </div>
  );
}