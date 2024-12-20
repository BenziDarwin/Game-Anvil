"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkinForm from "./SkinForm";
import ModForm from "./ModForm";
import SoundForm from "./SoundForm";
import ItemForm from "./ItemForm";
import ArtForm from "./ArtForm";
import MapForm from "./MapForm";
import AnimationForm from "./AnimationForm";
import { NFTCategory } from "@/lib/types/nft";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

const NFT_TYPES: { value: NFTCategory; label: string; color: string }[] = [
  { value: "skins", label: "Game Skins", color: "#FF6B6B" },
  { value: "mods", label: "Game Mods", color: "#4ECDC4" },
  { value: "sounds", label: "Sound & Music", color: "#45B7D1" },
  { value: "items", label: "In-game Items", color: "#FFA07A" },
  { value: "art", label: "Game Art", color: "#98D8C8" },
  { value: "maps", label: "Game Maps", color: "#F7B801" },
  { value: "animations", label: "Animations", color: "#C3AED6" },
];

const formVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    rotate: 10,
    transition: { duration: 0.2 },
  },
};

const backgroundVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function NFTForms() {
  const [category, setCategory] = useState<NFTCategory>("skins");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const backgroundControls = useAnimation();

  const FormComponent = {
    skins: SkinForm,
    mods: ModForm,
    sounds: SoundForm,
    items: ItemForm,
    art: ArtForm,
    maps: MapForm,
    animations: AnimationForm,
  }[category];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    backgroundControls.start({
      backgroundColor:
        NFT_TYPES.find((t) => t.value === category)?.color || "#FFFFFF",
    });
  }, [category, backgroundControls]);

  return (
    <Tabs
      value={category}
      onValueChange={(value) => setCategory(value as NFTCategory)}
    >
      {/* Responsive Dropdown for small and medium screens */}
      <div className="lg:hidden mb-8" ref={dropdownRef}>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-between w-full bg-transparent border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-105">
              <span className="font-semibold text-lg p-2">
                {NFT_TYPES.find((type) => type.value === category)?.label ||
                  "Select Category"}
              </span>
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl animate-in slide-in-from-top-2">
            {NFT_TYPES.map((type) => (
              <DropdownMenuItem
                key={type.value}
                onClick={() => {
                  setCategory(type.value);
                  setIsDropdownOpen(false);
                }}
                className="px-4 py-3 text-gray-700 bg-transparent hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              >
                <div className="flex items-center space-x-2 bg-transparent">
                  <div
                    className="w-4 h-4 rounded-full bg-transparent"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="font-medium bg-transparent p-1">
                    {type.label}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grid of tabs for larger screens */}
      <TabsList className="hidden lg:grid grid-cols-7 mb-8 gap-3 bg-transparent">
        {NFT_TYPES.map((type) => (
          <TabsTrigger
            key={type.value}
            value={type.value}
            className="px-5 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: type.value === category ? type.color : "white",
              color: type.value === category ? "white" : "black",
            }}
          >
            {type.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent
        value={category}
        className="relative overflow-hidden rounded-xl bg-transparent"
      >
        <motion.div
          className="absolute inset-0 -z-10 bg-transparent"
          initial="hidden"
          animate={backgroundControls}
          variants={backgroundVariants}
          transition={{ duration: 0.5 }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-transparent bg-opacity-90 rounded-xl shadow-2xl bg-transparent"
          >
            <FormComponent />
          </motion.div>
        </AnimatePresence>
      </TabsContent>
    </Tabs>
  );
}
