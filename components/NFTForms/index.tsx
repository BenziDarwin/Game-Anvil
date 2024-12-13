'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SkinForm from './SkinForm';
import ModForm from './ModForm';
import SoundForm from './SoundForm';
import ItemForm from './ItemForm';
import ArtForm from './ArtForm';
import MapForm from './MapForm';
import AnimationForm from './AnimationForm';
import { NFTCategory } from '@/lib/types/nft';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';

const NFT_TYPES: { value: NFTCategory; label: string }[] = [
  { value: 'skins', label: 'Game Skins' },
  { value: 'mods', label: 'Game Mods' },
  { value: 'sounds', label: 'Sounds & Music' },
  { value: 'items', label: 'In-game Items' },
  { value: 'art', label: 'Game Art' },
  { value: 'maps', label: 'Game Maps' },
  { value: 'animations', label: 'Animations' },
];

export default function NFTForms() {
  const [category, setCategory] = useState<NFTCategory>('skins');

  const FormComponent = {
    skins: SkinForm,
    mods: ModForm,
    sounds: SoundForm,
    items: ItemForm,
    art: ArtForm,
    maps: MapForm,
    animations: AnimationForm,
  }[category];

  return (
    <Tabs value={category} onValueChange={(value) => setCategory(value as NFTCategory)}>
      {/* Dropdown for small screens using shadcn-ui */}
      <div className="sm:hidden mb-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none">
              {NFT_TYPES.find((type) => type.value === category)?.label || 'Select Category'}
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full mt-2 bg-white border border-gray-200 rounded shadow-lg">
            {NFT_TYPES.map((type) => (
              <DropdownMenuItem
                key={type.value}
                onClick={() => setCategory(type.value)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {type.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grid of tabs for larger screens */}
      <TabsList className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 mb-8 gap-4">
        {NFT_TYPES.map((type) => (
          <TabsTrigger key={type.value} value={type.value}>
            {type.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={category}>
        <FormComponent />
      </TabsContent>
    </Tabs>
  );
}
