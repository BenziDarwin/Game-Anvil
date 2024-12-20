"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useIPFSUpload } from "@/hooks/useIPFSUpload";
import { DraggableBox } from "../DraggableBox";
import { GameList } from "../GameList";
import { getCollection } from "@/firebase/firestore";
import { auth } from "@/firebase/config";
import CollectionsSelect from "./CollectionSelect";

interface Game {
  id: number;
  name: string;
}

export default function ItemForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    itemType: "",
    rarity: "",
    level: "",
    stats: "",
    usageInstructions: "",
    collection: "",
    image: null as File | null,
  });
  const [collections, setCollections] = useState<any[]>([]);

  const { uploadToIPFS, isUploading } = useIPFSUpload();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ipfsHash = await uploadToIPFS(file);
      console.log("Uploaded to IPFS:", ipfsHash);
    }
  };
  const handleImageUpload = (file: File) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSelectedGamesChange = (selectedGame: Game | null) => {
    setFormData((prev) => ({ ...prev, gameID: selectedGame?.id.toString() }));
  };

  const fetchCollections = async () => {
    try {
      const data = await getCollection("collections", [
        { field: "creator", operator: "==", value: auth.currentUser?.uid },
      ]);
      console.log(data);
    } catch (error) {
      console.error("Fetch collections failed:", error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="collection">Collection</Label>
        <CollectionsSelect
          collections={collections}
          value={formData.collection}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, collection: value }))
          }
        />
      </div>
      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Upload NFT Image</h2>
          <DraggableBox
            onDrop={handleImageUpload}
            image={formData.image || undefined}
          />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Compatible Games</h2>
          <GameList onSelectedGameChange={handleSelectedGamesChange} />
        </div>
      </div>
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="itemType">Item Type</Label>
          <Select
            value={formData.itemType}
            onValueChange={(value) =>
              setFormData({ ...formData, itemType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Item Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weapon">Weapon</SelectItem>
              <SelectItem value="armor">Armor</SelectItem>
              <SelectItem value="consumable">Consumable</SelectItem>
              <SelectItem value="collectible">Collectible</SelectItem>
              <SelectItem value="resource">Resource</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rarity">Rarity</Label>
          <Select
            value={formData.rarity}
            onValueChange={(value) =>
              setFormData({ ...formData, rarity: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="uncommon">Uncommon</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="epic">Epic</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Required Level</Label>
          <Input
            id="level"
            type="number"
            value={formData.level}
            onChange={(e) =>
              setFormData({ ...formData, level: e.target.value })
            }
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stats">Item Stats</Label>
          <Textarea
            id="stats"
            value={formData.stats}
            onChange={(e) =>
              setFormData({ ...formData, stats: e.target.value })
            }
            placeholder="Enter item statistics (damage, defense, etc.)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Item Preview</Label>
          <Input
            id="file"
            type="file"
            accept=".png,.jpg,.jpeg,.gif"
            onChange={handleFileUpload}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Create Item NFT"}
        </Button>
      </form>
    </div>
  );
}
