export type NFTCategory =
  | "skins"
  | "mods"
  | "sounds"
  | "items"
  | "art"
  | "maps"
  | "animations";

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  category: NFTCategory;
  attributes: Record<string, any>;
  gameId?: string;
}

export interface GameMetadata {
  id: string;
  name: string;
  description: string;
  publisher: string;
  releaseDate: string;
  website: string;
  genres: string[];
  platforms: string[];
}
