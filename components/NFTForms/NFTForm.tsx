"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { addDocument, getCollection } from "@/firebase/firestore";
import { useEffect, useState, useCallback, useMemo } from "react";
import { DraggableBox } from "../DraggableBox";
import CollectionsSelect from "./CollectionSelect";
import { useIPFSUpload } from "@/hooks/useIPFSUpload";
import { getEthereumContract } from "@/utils/ethereum";
import GameNFT from "@/contracts/GameNFT.json";
import { ethers } from "ethers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import type { NFT } from "@/lib/types";
import { LoadingDialog } from "./LoadingDialog";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  description: string;
  image: string;
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

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  creationFee,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  creationFee: string;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm NFT Creation</DialogTitle>
        <DialogDescription>
          You are about to create an NFT for {creationFee} ETH. This will
          contribute to its base price. Do you want to proceed?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const NftForm = ({ collectionDialog }: { collectionDialog: boolean }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    image: "",
    file: { path: "", key: new Uint8Array() },
    collection: "",
    nftType: "skins",
    dynamicFields: [],
  });
  const { toast } = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadToIPFS, uploadToIPFSNoEncryption } = useIPFSUpload();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const router = useRouter();
  const [loadingState, setLoadingState] = useState<{
    isLoading: boolean;
    message: string;
  }>({ isLoading: false, message: "" });

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setLoadingState({ isLoading: true, message: "Uploading file..." });
      try {
        if (file) {
          setImageFile(file);
          const { ipfs, key } = await uploadToIPFS(file);
          setFormData((prev) => ({
            ...prev,
            file: { path: `https://${ipfs}.ipfs.w3s.link`, key: key },
          }));
        } else {
          throw new Error("No file selected");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "File upload failed",
          variant: "destructive",
        });
      } finally {
        setLoadingState({ isLoading: false, message: "" });
      }
    },
    [uploadToIPFS],
  );

  const fetchCollections = useCallback(async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return;
      }
      const collections = await getCollection("collections", [
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
      toast({
        title: "Error",
        description: "Error fetching collections",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections, collectionDialog]);

  const handleImageUpload = useCallback(
    async (file: File) => {
      setLoadingState({ isLoading: true, message: "Uploading image..." });
      try {
        const hash = await uploadToIPFSNoEncryption(file);
        console.log("Image uploaded to IPFS:", hash);

        setFormData((prev) => ({
          ...prev,
          image: `https://${hash}.ipfs.w3s.link`,
        }));
      } catch (error) {
        console.error("Upload failed:", error);
        toast({
          title: "Error",
          description: "Image upload failed",
          variant: "destructive",
        });
      } finally {
        setLoadingState({ isLoading: false, message: "" });
      }
    },
    [uploadToIPFSNoEncryption],
  );

  const addDynamicField = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      dynamicFields: [
        ...prev.dynamicFields,
        { key: "", value: "", type: "text" },
      ],
    }));
  }, []);

  const updateDynamicField = useCallback(
    (index: number, field: keyof DynamicField, value: string) => {
      setFormData((prev) => ({
        ...prev,
        dynamicFields: prev.dynamicFields.map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        ),
      }));
    },
    [],
  );

  const removeDynamicField = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      dynamicFields: prev.dynamicFields.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      setIsConfirmDialogOpen(true);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Error preparing NFT creation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const createNFT = useCallback(
    async (tokenURI: string, contractAddress: string, creationFee: string) => {
      setLoadingState({ isLoading: true, message: "Creating NFT..." });
      try {
        const abi = GameNFT.abi;
        const contract = await getEthereumContract(contractAddress, abi);

        const transaction = await contract.createNFT(tokenURI, {
          value: ethers.parseEther(creationFee),
        });

        const receipt = await transaction.wait();

        console.log("NFT Created Successfully!", receipt);

        // Manually decode logs if events are missing
        const iface = new ethers.Interface(abi);
        let tokenId: string | undefined;

        for (const log of receipt.logs) {
          try {
            const parsedLog = iface.parseLog(log);
            if (parsedLog && parsedLog.name === "NFTCreated") {
              tokenId = parsedLog.args.tokenId.toString();
              break;
            }
          } catch (error) {
            // Ignore logs that don't match ABI events
          }
        }

        if (!tokenId) {
          throw new Error("Failed to retrieve Token ID from event");
        }

        console.log("Token ID:", tokenId);

        toast({
          title: "NFT Created",
          description: "NFT created successfully",
          variant: "default",
        });
        return tokenId;
      } catch (error) {
        console.error("Error creating NFT:", error);
        toast({
          title: "Error",
          description: "Error creating NFT",
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoadingState({ isLoading: false, message: "" });
      }
    },
    [],
  );

  const handleConfirmNFTCreation = useCallback(async () => {
    setIsConfirmDialogOpen(false);
    setLoadingState({ isLoading: true, message: "Preparing NFT data..." });
    const data = {
      meta: formData.dynamicFields,
      image: formData.image,
      file: formData.file.path,
      description: formData.description,
      type: formData.nftType,
    };
    try {
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const file = new File([blob], "formData.json", {
        type: "application/json",
      });

      setLoadingState({
        isLoading: true,
        message: "Uploading NFT metadata...",
      });
      const hash = await uploadToIPFSNoEncryption(file);

      setLoadingState({
        isLoading: true,
        message: "Creating NFT on blockchain...",
      });
      const tokenId = await createNFT(
        `https://${hash}.ipfs.w3s.link`,
        formData.collection,
        "0.005",
      );
      console.log("Token ID:", tokenId);

      if (tokenId) {
        setLoadingState({
          isLoading: true,
          message: "Saving NFT to database...",
        });
        const nft: NFT = {
          title: formData.name,
          description: formData.description,
          creator: auth.currentUser!.uid,
          price: "0.005",
          image: formData.image,
          collection: formData.collection,
          category: formData.nftType,
          created: new Date().toISOString(),
          tokenId: tokenId,
        };

        await addDocument("nfts", nft);

        setFormData({
          name: "",
          description: "",
          image: "",
          file: { path: "", key: new Uint8Array() },
          collection: "",
          nftType: "skins",
          dynamicFields: [],
        });

        toast({
          title: "NFT Created",
          description: "NFT created and saved successfully",
          variant: "default",
        });
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error in NFT creation:", error);
      toast({
        title: "Error",
        description: "Failed to create NFT",
        variant: "destructive",
      });
    } finally {
      setLoadingState({ isLoading: false, message: "" });
    }
  }, [createNFT, formData, uploadToIPFSNoEncryption, router]);

  const memoizedNFTTypes = useMemo(() => NFT_TYPES, []);

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
                    {memoizedNFTTypes.map((type) => (
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
                  disabled={isUploading || loading}
                />
              </div>
              <div>
                <Label htmlFor="file">NFT File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".png,.jpg,.jpeg,.gif"
                  onChange={handleFileUpload}
                  disabled={isUploading || loading}
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
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">
                Additional Properties
              </Label>
              <Button
                type="button"
                variant="outline"
                onClick={addDynamicField}
                className="text-sm"
              >
                Add Property
              </Button>
            </div>
            {formData.dynamicFields.map((field, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`key-${index}`}>Key</Label>
                    <Input
                      id={`key-${index}`}
                      placeholder="Key"
                      value={field.key}
                      onChange={(e) =>
                        updateDynamicField(index, "key", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`type-${index}`}>Type</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value: "number" | "text" | "textarea") =>
                        updateDynamicField(index, "type", value)
                      }
                    >
                      <SelectTrigger id={`type-${index}`}>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="textarea">Text Area</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`value-${index}`}>Value</Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={`value-${index}`}
                        placeholder="Value"
                        value={field.value}
                        onChange={(e: any) =>
                          updateDynamicField(index, "value", e.target.value)
                        }
                      />
                    ) : (
                      <Input
                        id={`value-${index}`}
                        type={field.type}
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) =>
                          updateDynamicField(index, "value", e.target.value)
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeDynamicField(index)}
                    className="text-sm"
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={handleSubmit}
          disabled={loading || isUploading}
        >
          {loading ? "Creating..." : "Create NFT"}
        </Button>
      </CardFooter>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmNFTCreation}
        creationFee={"0.005"}
      />
      <LoadingDialog
        isOpen={loadingState.isLoading}
        message={loadingState.message}
      />
    </Card>
  );
};

export default NftForm;
