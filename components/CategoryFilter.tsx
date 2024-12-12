'use client';

import { Button } from '@/components/ui/button';
import { GAME_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Button
        variant={selectedCategory === 'all' ? 'default' : 'outline'}
        className={cn(
          selectedCategory === 'all' && 'bg-orange-500 hover:bg-orange-600'
        )}
        onClick={() => onCategoryChange('all')}
      >
        All Categories
      </Button>
      {GAME_CATEGORIES.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'outline'}
          className={cn(
            selectedCategory === category.id && 'bg-orange-500 hover:bg-orange-600'
          )}
          onClick={() => onCategoryChange(category.id)}
        >
          <category.icon className="w-4 h-4 mr-2" />
          {category.name}
        </Button>
      ))}
    </div>
  );
}