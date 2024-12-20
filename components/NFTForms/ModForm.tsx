"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useIPFSUpload } from "@/hooks/useIPFSUpload";
import { DraggableBox } from "../DraggableBox";
import { GameList } from "../GameList";
import { getCollection } from "@/firebase/firestore";
import { auth } from "@/firebase/config";
import CollectionsSelect from "./CollectionSelect";
import { collection } from "firebase/firestore";

interface Game {
  id: number;
  name: string;
}

export default function ModForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gameVersion: "",
    modType: "",
    requirements: "",
    installationGuide: "",
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
          <Label htmlFor="name">Mod Name</Label>
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
          <Label htmlFor="gameVersion">Game Version</Label>
          <Input
            id="gameVersion"
            value={formData.gameVersion}
            onChange={(e) =>
              setFormData({ ...formData, gameVersion: e.target.value })
            }
            placeholder="e.g., 1.18.2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rarity">Mod Type</Label>
          <Select
            value={formData.modType}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, modType: value }))
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Mod Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gameplay">Gameplay</SelectItem>
              <SelectItem value="visual">Visual</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="utility">Utility</SelectItem>
              <SelectItem value="content">Content Pack</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirements">Requirements</Label>
          <Textarea
            id="requirements"
            value={formData.requirements}
            onChange={(e) =>
              setFormData({ ...formData, requirements: e.target.value })
            }
            placeholder="List any required dependencies or system requirements"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="installationGuide">Installation Guide</Label>
          <Textarea
            id="installationGuide"
            value={formData.installationGuide}
            onChange={(e) =>
              setFormData({ ...formData, installationGuide: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Mod File</Label>
          <Input
            id="file"
            type="file"
            accept=".zip,.rar,.7z"
            onChange={handleFileUpload}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Create Mod NFT"}
        </Button>
      </form>
    </div>
  );
}
