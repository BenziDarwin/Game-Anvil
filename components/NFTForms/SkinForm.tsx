"use client";

import React, { useEffect, useState } from "react";
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

interface SkinFormData {
  name: string;
  description: string;
  character: string;
  rarity: string;
  image?: File;
  gameId?: string;
  effects?: string;
  collection: string;
}

interface Game {
  id: number;
  name: string;
}

export default function SkinForm() {
  const [formData, setFormData] = useState<SkinFormData>({
    name: "",
    description: "",
    character: "",
    rarity: "",
    collection: "",
  });
  const [collections, setCollections] = useState<any[]>([]);

  const { uploadToIPFS, isUploading } = useIPFSUpload();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      try {
        const ipfsHash = await uploadToIPFS(file);
        console.log("Uploaded to IPFS:", ipfsHash);
      } catch (error) {
        console.error("Upload failed:", error);
        // Optionally add user-facing error handling
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!formData.name || !formData.rarity || !imageFile) {
      alert("Please fill in all required fields and upload an image");
      return;
    }

    // Add form submission logic
    console.log("Form submitted:", formData);
  };

  const handleImageUpload = (file: File) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSelectedGamesChange = (selectedGame: Game | null) => {
    setFormData((prev) => ({ ...prev, gameId: selectedGame?.id.toString() }));
  };

  const fetchCollections = async () => {
    try {
      const data = await getCollection("collections", [
        { field: "creator", operator: "==", value: auth.currentUser?.uid },
      ]);
      console.log(data);
      setCollections(data);
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
          <DraggableBox onDrop={handleImageUpload} image={formData.image} />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Compatible Games</h2>
          <GameList onSelectedGameChange={handleSelectedGamesChange} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Skin Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="character">Character/Model</Label>
          <Input
            id="character"
            value={formData.character}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, character: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rarity">Rarity</Label>
          <Select
            value={formData.rarity}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, rarity: value }))
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="epic">Epic</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Skin File</Label>
          <Input
            id="file"
            type="file"
            accept=".png,.jpg,.jpeg,.gif"
            onChange={handleFileUpload}
            required
          />
          {imageFile && (
            <p className="text-sm text-green-600 mt-2">
              {imageFile.name} selected
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Create Skin NFT"}
        </Button>
      </form>
    </div>
  );
}
