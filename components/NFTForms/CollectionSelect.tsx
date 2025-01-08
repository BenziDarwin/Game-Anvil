import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
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
      <SelectTrigger className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white border-none rounded-md shadow-md hover:opacity-90 transition-all duration-300">
        <SelectValue placeholder="Select a collection" />
      </SelectTrigger>
      <SelectContent className="bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg rounded-md max-h-80 overflow-auto mt-2 z-10">
        <SelectGroup>
          {collections.map((collection) => (
            <SelectItem
              key={collection.address}
              value={collection.address}
              className="group relative hover:bg-transparent"
            >
              <div
                className="flex items-center justify-between w-full p-2 rounded-md 
                          transition-all duration-300 ease-in-out hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-black font-medium">
                    {collection.name}
                  </span>
                  <span className="text-black text-sm text-opacity-70">
                    {collection.symbol}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CollectionsSelect;
