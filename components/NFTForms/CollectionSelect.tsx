import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Collection {
  address: string;
  name: string;
  symbol: string;
}

interface CollectionsSelectProps {
  collections: Collection[];
  value: string;
  onValueChange: (value: string) => void;
}

const CollectionsSelect = ({
  collections,
  value,
  onValueChange,
}: CollectionsSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white border-none hover:opacity-90 transition-all duration-300">
        <SelectValue placeholder="Select a collection" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectGroup>
          <SelectLabel className="px-2 py-1.5">Your Collections</SelectLabel>
          {collections.map((collection) => (
            <SelectItem
              key={collection.address}
              value={collection.address}
              className="group relative"
            >
              <div
                className="flex items-center justify-between w-full p-2 rounded-md
                           transition-all duration-300"
              >
                <div className="flex flex-col">
                  <span className="text-white">{collection.name}</span>
                  <span className="text-gray-400 text-sm">
                    {collection.symbol}
                  </span>
                </div>
                <span className="text-gray-500 text-xs font-mono">
                  {collection.address.slice(0, 6)}...
                  {collection.address.slice(-4)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CollectionsSelect;
