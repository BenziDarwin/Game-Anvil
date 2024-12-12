'use client';

import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VerifiedIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const collectors = [
  {
    name: 'CryptoWhale',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    volume: '1,234.56 ETH',
    verified: true,
  },
  {
    name: 'NFTKing',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    volume: '987.65 ETH',
    verified: true,
  },
  {
    name: 'ArtCollector',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
    volume: '654.32 ETH',
    verified: false,
  },
];

export default function TopCollectors() {
  const router = useRouter();
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Top Collectors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collectors.map((collector, index) => (
          <Card key={collector.name} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/profile/1")}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <img src={collector.avatar} alt={collector.name} />
                </Avatar>
                <div className="absolute -top-2 -left-2">
                  <Badge className="bg-orange-500 text-white">#{index + 1}</Badge>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{collector.name}</h3>
                  {collector.verified && (
                    <VerifiedIcon className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600">Volume: {collector.volume}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}