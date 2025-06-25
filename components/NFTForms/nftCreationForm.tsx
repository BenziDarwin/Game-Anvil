"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useState, useCallback } from "react";
import { DraggableBox } from "../DraggableBox";
import CollectionsSelect from "./CollectionSelect";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Loader2 } from "lucide-react";
import type {
  DraftNFT,
  DynamicField,
  Collection,
  NFTCategory,
} from "@/types/drafts";

const NFT_TYPES: { value: NFTCategory; label: string }[] = [
  { value: "skins", label: "Game Skins" },
  { value: "mods", label: "Game Mods" },
  { value: "sounds", label: "Sound & Music" },
  { value: "items", label: "In-game Items" },
  { value: "art", label: "Game Art" },
  { value: "maps", label: "Game Maps" },
  { value: "animations", label: "Animations" },
];

interface NFTCreationFormProps {
  collections: Collection[];
  onSaveDraft: (
    draft: Omit<DraftNFT, "id" | "createdAt" | "status" | "userId">,
    files: { imageFile?: File; gameFile?: File },
  ) => Promise<string>;
  initialData?: DraftNFT;
  initialFiles?: { imageFile?: File; gameFile?: File };
  isEditing?: boolean;
  onUpdateDraft?: (
    id: string,
    updates: Partial<DraftNFT>,
    files?: { imageFile?: File; gameFile?: File },
  ) => Promise<void>;
}

export default function NFTCreationForm({
  collections,
  onSaveDraft,
  initialData,
  initialFiles,
  isEditing = false,
  onUpdateDraft,
}: NFTCreationFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    collection: initialData?.collection || "",
    nftType: initialData?.nftType || ("skins" as NFTCategory),
    dynamicFields: initialData?.dynamicFields || ([] as DynamicField[]),
  });

  const [imageFile, setImageFile] = useState<File | null>(
    initialFiles?.imageFile || null,
  );
  const [gameFile, setGameFile] = useState<File | null>(
    initialFiles?.gameFile || null,
  );
  const [imagePreview, setImagePreview] = useState<string>("");

  // Create image preview when file changes
  useState(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  });

  const handleImageUpload = useCallback((file: File) => {
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }, []);

  const handleGameFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setGameFile(file);
      }
    },
    [],
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        if (!formData.name.trim()) {
          toast({
            title: "Validation Error",
            description: "NFT name is required",
            variant: "destructive",
          });
          return;
        }

        if (!imageFile) {
          toast({
            title: "Validation Error",
            description: "NFT image is required",
            variant: "destructive",
          });
          return;
        }

        if (!gameFile) {
          toast({
            title: "Validation Error",
            description: "NFT file is required",
            variant: "destructive",
          });
          return;
        }

        if (!formData.collection) {
          toast({
            title: "Validation Error",
            description: "Collection selection is required",
            variant: "destructive",
          });
          return;
        }

        const draftData = {
          name: formData.name,
          description: formData.description,
          collection: formData.collection,
          nftType: formData.nftType,
          dynamicFields: formData.dynamicFields,
        };

        const files = { imageFile, gameFile };

        if (isEditing && initialData && onUpdateDraft) {
          await onUpdateDraft(initialData.id!, draftData, files);
          toast({
            title: "Draft Updated",
            description: "Your NFT draft has been updated successfully",
          });
        } else {
          await onSaveDraft(draftData, files);
          // Reset form
          setFormData({
            name: "",
            description: "",
            collection: "",
            nftType: "skins",
            dynamicFields: [],
          });
          setImageFile(null);
          setGameFile(null);
          setImagePreview("");
          toast({
            title: "Draft Saved",
            description: "Your NFT draft has been saved successfully",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save draft. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      imageFile,
      gameFile,
      onSaveDraft,
      onUpdateDraft,
      initialData,
      isEditing,
      toast,
    ],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit NFT Draft" : "Create NFT Draft"}
        </CardTitle>
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
                  placeholder="Enter NFT name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your NFT"
                  rows={3}
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
                        {type.label}
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
                  image={imagePreview}
                  disabled={loading}
                />
                {imageFile && (
                  <p className="text-sm text-green-600 mt-2">
                    {imageFile.name}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="gameFile">NFT File</Label>
                <Input
                  id="gameFile"
                  type="file"
                  accept=".png,.jpg,.jpeg,.gif,.zip,.rar,.7z"
                  onChange={handleGameFileUpload}
                  required={!isEditing}
                  disabled={loading}
                />
                {gameFile && (
                  <p className="text-sm text-green-600 mt-2">{gameFile.name}</p>
                )}
              </div>
            </div>
          </div>

          {formData.dynamicFields.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-medium">Properties</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDynamicField}
                  disabled={loading}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              {formData.dynamicFields.map((field, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg"
                >
                  <Input
                    placeholder="Property name"
                    value={field.key}
                    onChange={(e) =>
                      updateDynamicField(index, "key", e.target.value)
                    }
                    disabled={loading}
                  />
                  <Select
                    value={field.type}
                    onValueChange={(value: "number" | "text" | "textarea") =>
                      updateDynamicField(index, "type", value)
                    }
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="textarea">Long Text</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.type === "textarea" ? (
                    <Textarea
                      placeholder="Value"
                      value={field.value}
                      onChange={(e) =>
                        updateDynamicField(index, "value", e.target.value)
                      }
                      disabled={loading}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      placeholder="Value"
                      value={field.value}
                      onChange={(e) =>
                        updateDynamicField(index, "value", e.target.value)
                      }
                      disabled={loading}
                    />
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeDynamicField(index)}
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {formData.dynamicFields.length === 0 && (
            <div className="text-center py-4">
              <Button
                type="button"
                variant="outline"
                onClick={addDynamicField}
                disabled={loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Properties
              </Button>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditing ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>{isEditing ? "Update Draft" : "Save Draft"}</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
