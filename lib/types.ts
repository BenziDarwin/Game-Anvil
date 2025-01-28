export interface NFT {
  id?: number;
  title: string;
  description: string;
  creator: string;
  price: string;
  image: string;
  category: NFTCategory;
  collection: string;
  created: string;
}

type NFTCategory =
  | "skins"
  | "mods"
  | "sounds"
  | "items"
  | "art"
  | "maps"
  | "animations";

export interface Collector {
  id: string;
  name: string;
  avatar: string;
  volume: string;
  verified: boolean;
  bio: string;
  joinedDate: string;
  collections: number;
  followers: number;
  following: number;
}
