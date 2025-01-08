"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { GameList } from "../GameList";
import CollectionsSelect from "./CollectionSelect";
import { DraggableBox } from "../DraggableBox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getCollection } from "@/firebase/firestore";
import { auth } from "@/firebase/config";

interface FormData {
  name: string;
  description: string;
  image: string;
  game: string;
  collectionAddress: string;
  file: { path: string; key: Uint8Array };
  collection: string;
  nftType: NFTCategory;
  dynamicFields: DynamicField[];
}

interface DynamicField {
  key: string;
  value: string;
  type: "number" | "text" | "textarea";
}

interface Collection {
  address: string;
  name: string;
  symbol: string;
}

type NFTCategory =
  | "skins"
  | "mods"
  | "sounds"
  | "items"
  | "art"
  | "maps"
  | "animations";

const NFT_TYPES: { value: NFTCategory; label: string; color: string }[] = [
  { value: "skins", label: "Game Skins", color: "#FF6B6B" },
  { value: "mods", label: "Game Mods", color: "#4ECDC4" },
  { value: "sounds", label: "Sound & Music", color: "#45B7D1" },
  { value: "items", label: "In-game Items", color: "#FFA07A" },
  { value: "art", label: "Game Art", color: "#98D8C8" },
  { value: "maps", label: "Game Maps", color: "#F7B801" },
  { value: "animations", label: "Animations", color: "#C3AED6" },
];

const NftForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    image: "",
    game: "",
    collectionAddress: "",
    file: { path: "", key: new Uint8Array() },
    collection: "",
    nftType: "skins",
    dynamicFields: [],
  });
  const [collections, setCollections] = useState<Collection[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Simulating file upload, replace with actual upload logic
      setFormData((prev) => ({
        ...prev,
        file: { path: URL.createObjectURL(file), key: new Uint8Array() },
      }));
    }
  };

  const fetchCollections = async () => {
    try {
      let currentUser = auth.currentUser;
      if (!currentUser) {
        return;
      }
      let collections = await getCollection("collections", [
        { field: "creator", operator: "==", value: currentUser.uid },
      ]);
      setCollections(
        collections.map((doc: any) => ({
          address: doc.address,
          name: doc.name,
          symbol: doc.symbol,
        })),
      );
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast.error("Error fetching collections");
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [collections]);

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    try {
      // Simulating image upload, replace with actual upload logic
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedGamesChange = (
    selectedGame: { id: number; name: string } | null,
  ) => {
    setFormData((prev) => ({ ...prev, game: selectedGame?.name || "" }));
  };

  const addDynamicField = () => {
    setFormData((prev) => ({
      ...prev,
      dynamicFields: [
        ...prev.dynamicFields,
        { key: "", value: "", type: "text" },
      ],
    }));
  };

  const updateDynamicField = (
    index: number,
    field: keyof DynamicField,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      dynamicFields: prev.dynamicFields.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeDynamicField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dynamicFields: prev.dynamicFields.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add form submission logic here
    console.log("Form submitted:", formData);
    setLoading(false);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Create NFT</CardTitle>
        <CardDescription>
          Fill in the details to create your new NFT
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="collection">Collection</Label>
                <CollectionsSelect
                  collections={collections}
                  value={formData.collection}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, collection: value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="name">NFT Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: any) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label>Compatible Game</Label>
                <GameList onSelectedGameChange={handleSelectedGamesChange} />
              </div>
              <div>
                <Label htmlFor="nftType">NFT Type</Label>
                <Select
                  value={formData.nftType}
                  onValueChange={(value: NFTCategory) =>
                    setFormData((prev) => ({ ...prev, nftType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select NFT Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {NFT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: type.color }}
                          ></div>
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>NFT Image</Label>
                <DraggableBox
                  onDrop={handleImageUpload}
                  image={formData.image}
                />
              </div>
              <div>
                <Label htmlFor="file">NFT File</Label>
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
            </div>
          </div>
          <div className="space-y-4">
            <Label>Additional Properties</Label>
            {formData.dynamicFields.map((field, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  placeholder="Key"
                  value={field.key}
                  onChange={(e) =>
                    updateDynamicField(index, "key", e.target.value)
                  }
                />
                <Select
                  value={field.type}
                  onValueChange={(value: "number" | "text" | "textarea") =>
                    updateDynamicField(index, "type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="textarea">Text Area</SelectItem>
                  </SelectContent>
                </Select>
                {field.type === "textarea" ? (
                  <Textarea
                    placeholder="Value"
                    value={field.value}
                    onChange={(e: any) =>
                      updateDynamicField(index, "value", e.target.value)
                    }
                  />
                ) : (
                  <Input
                    type={field.type}
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) =>
                      updateDynamicField(index, "value", e.target.value)
                    }
                  />
                )}
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeDynamicField(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addDynamicField}>
              Add Property
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create NFT"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NftForm;
