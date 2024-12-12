'use client';

import { Card } from '@/components/ui/card';
import { Gamepad, MapPin, Music, Palette, Shirt, Move } from 'lucide-react';
import { useRouter } from 'next/navigation';

const categories = [
  { name: 'Game Art', icon: Palette, count: '32,543' },
  { name: 'Music & Sounds', icon: Music, count: '15,234' },
  { name: 'Skins', icon: Shirt, count: '8,765' },
  { name: 'In-Game Items', icon: Gamepad, count: '6,543' },
  { name: 'Maps', icon: MapPin, count: '12,432' },
  { name: 'Animations', icon: Move, count: '21,876' },
];

export default function Categories() {
  const router = useRouter();
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.name}
              className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => router.push("/explore")}
            >
              <div className="flex justify-center mb-4">
                <Icon className="h-8 w-8 text-orange-500 group-hover:text-orange-600 transition-colors" />
              </div>
              <h3 className="font-semibold mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.count} items</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}