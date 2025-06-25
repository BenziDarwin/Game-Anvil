export interface DraftNFT {
  id?: string; // Firebase document ID
  name: string;
  description: string;
  imageFileName?: string;
  gameFileName?: string;
  collection: string;
  nftType: NFTCategory;
  dynamicFields: DynamicField[];
  createdAt: string;
  updatedAt?: string;
  status: "draft" | "uploading" | "completed" | "failed";
  userId: string;
  progress?: {
    step: number;
    totalSteps: number;
    currentStep: string;
    percentage: number;
  };
}

export interface DynamicField {
  key: string;
  value: string;
  type: "number" | "text" | "textarea";
}

export interface Collection {
  address: string;
  name: string;
  symbol: string;
}

export type NFTCategory =
  | "skins"
  | "mods"
  | "sounds"
  | "items"
  | "art"
  | "maps"
  | "animations";
