export interface User {
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
  location?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
}
