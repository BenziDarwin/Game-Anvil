'use client';

import { useState } from 'react';
import CategoryFilter from '@/components/CategoryFilter';
import NFTGrid from '@/components/NFTGrid';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Search } from 'lucide-react';

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Explore Gaming NFTs</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search NFTs..."
              className="pl-10"
            />
          </div>
          <Select>
            <option value="recent">Recently Listed</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </Select>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <NFTGrid category={selectedCategory} />
      </div>
    </main>
  );
}