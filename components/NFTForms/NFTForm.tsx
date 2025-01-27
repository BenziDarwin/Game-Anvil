"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { auth } from "@/firebase/config";
import { getCollection } from "@/firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DraggableBox } from "../DraggableBox";
import CollectionsSelect from "./CollectionSelect";
import { useIPFSUpload } from "@/hooks/useIPFSUpload";
import { getEthereumContract } from "@/utils/ethereum";
import GameNFT from "@/contracts/GameNFT.json";
import { ethers } from "ethers";

interface FormData {
  name: string;
  description: string;
  image: string;
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
    collectionAddress: "",
    file: { path: "", key: new Uint8Array() },
    collection: "",
    nftType: "skins",
    dynamicFields: [],
  });
  const [collections, setCollections] = useState<Collection[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { uploadToIPFS, uploadToIPFSNoEncryption } = useIPFSUpload();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Simulating file upload, replace with actual upload logic
      let { ipfs, key } = await uploadToIPFS(file);
      setFormData((prev) => ({
        ...prev,
        file: { path: ipfs.cid + "File", key: new Uint8Array() },
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
      let hash = await uploadToIPFSNoEncryption(file);

      setFormData((prev) => ({ ...prev, image: hash }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
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
    let data = {
      meta: formData.dynamicFields,
      image: `https://dweb.link/ipfs/${formData.image}`,
      file: formData.file.path,
      description: formData.description,
      type: formData.nftType,
    };
    try {
      // Convert the data to a file
      const jsonData = JSON.stringify(data, null, 2); // Format for readability
      const blob = new Blob([jsonData], { type: "application/json" });

      // Create a file-like object (e.g., for upload)
      const file = new File([blob], "formData.json", {
        type: "application/json",
      });

      const hash = await uploadToIPFSNoEncryption(file);

      await createNFT(
        `https://dweb.link/ipfs/${hash}`,
        formData.collection,
        "0.05",
      );
    } catch (e) {}
    console.log("Form submitted:", formData);
    setLoading(false);
  };

  const createNFT = async (
    tokenURI: string,
    contractAddress: string,
    creationFee: string, // Pass the required creation fee
  ) => {
    try {
      // Fetch the contract ABI and create the contract instance
      let abi = GameNFT.abi;
      let contract = await getEthereumContract(contractAddress, abi);

      // Call the createNFT function with the tokenURI and send the creation fee
      const transaction = await contract.createNFT(tokenURI, {
        value: ethers.parseEther(creationFee), // Convert fee to wei
      });

      // Wait for the transaction to be confirmed
      const receipt = await transaction.wait();

      console.log("NFT Created Successfully!", receipt);

      // Extract the new token ID from the emitted event (if needed)
      const event = receipt.events?.find((e: any) => e.event === "NFTCreated");
      const tokenId = event?.args?.[0]; // Assuming the first argument is the token ID

      console.log("New Token ID:", tokenId);
      return tokenId;
    } catch (error) {
      console.error("Error creating NFT:", error);
      throw error;
    }
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
