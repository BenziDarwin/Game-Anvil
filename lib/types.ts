export interface NFT {
  id: number;
  title: string;
  description: string;
  creator: string;
  creatorId: string;
  price: string;
  image: string;
  likes: number;
  category: GameCategory;
  game: string;
  created: string;
}

export type GameCategory = "skins" | "mods" | "sounds" | "items";

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
