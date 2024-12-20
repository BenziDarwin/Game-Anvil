import {
  Sword,
  Brush,
  Music,
  Package,
  Palette,
  MapPin,
  Move,
} from "lucide-react";

export const GAME_CATEGORIES = [
  { id: "skins", name: "Game Skins", icon: Brush, count: "45,234" },
  { id: "mods", name: "Game Mods", icon: Sword, count: "23,456" },
  { id: "sounds", name: "Sounds & Music", icon: Music, count: "12,345" },
  { id: "items", name: "In-game Items", icon: Package, count: "34,567" },
  { id: "art", name: "Game Art", icon: Palette, count: "32,543" },
  { id: "maps", name: "Maps & Levels", icon: MapPin, count: "18,765" },
  { id: "animations", name: "Animations", icon: Move, count: "21,876" },
];
