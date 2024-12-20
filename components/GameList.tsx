"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface Game {
  id: number;
  name: string;
}

const games: Game[] = [
  { id: 1, name: "Minecraft" },
  { id: 2, name: "Fortnite" },
  { id: 3, name: "Among Us" },
  { id: 4, name: "Call of Duty: Warzone" },
  { id: 5, name: "Apex Legends" },
  { id: 6, name: "Valorant" },
  { id: 7, name: "League of Legends" },
  { id: 8, name: "Dota 2" },
  { id: 9, name: "Counter-Strike 2" },
  { id: 10, name: "Rocket League" },
  { id: 11, name: "Rainbow Six Siege" },
  { id: 12, name: "Overwatch" },
];

interface GameListProps {
  onSelectedGameChange: (selectedGame: Game | null) => void;
}

export function GameList({ onSelectedGameChange }: GameListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Memoized filtered games to improve performance
  const filteredGames = useMemo(
    () =>
      games.filter((game) =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm],
  );

  const handleGameSelect = (game: Game) => {
    const newSelectedGame = selectedGame?.id === game.id ? null : game;
    setSelectedGame(newSelectedGame);
    onSelectedGameChange(newSelectedGame);
  };

  const clearSelection = () => {
    setSelectedGame(null);
    onSelectedGameChange(null);
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search games..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Selected Game */}
      {selectedGame && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">Selected Game</p>
            <p className="text-sm text-gray-600">{selectedGame.name}</p>
          </div>
          <button
            onClick={clearSelection}
            className="text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Clear selection"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Scrollable Game List */}
      <ScrollArea className="h-40 w-full rounded-md border p-2">
        <RadioGroup
          onValueChange={(value) => {
            const game = games.find((g) => g.id === Number(value));
            if (game) handleGameSelect(game);
          }}
          value={selectedGame?.id?.toString() || ""}
        >
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="flex items-center space-x-3 py-2 hover:bg-gray-50 rounded-md px-2 transition-colors"
            >
              <RadioGroupItem
                value={game.id.toString()}
                id={`game-${game.id}`}
              />
              <Label
                htmlFor={`game-${game.id}`}
                className="flex-1 cursor-pointer"
              >
                {game.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </ScrollArea>
    </div>
  );
}
