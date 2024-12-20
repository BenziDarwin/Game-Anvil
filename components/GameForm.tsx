"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GameMetadata } from "@/lib/types/nft";
import { Badge } from "@/components/ui/badge";

const GENRES = [
  "Action",
  "RPG",
  "Strategy",
  "Sports",
  "Adventure",
  "Simulation",
];
const PLATFORMS = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"];

export default function GameForm() {
  const [game, setGame] = useState<Partial<GameMetadata>>({
    genres: [],
    platforms: [],
  });

  const toggleSelection = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement game registration logic
    console.log("Game data:", game);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Game Name</Label>
        <Input
          id="name"
          value={game.name || ""}
          onChange={(e) => setGame({ ...game, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={game.description || ""}
          onChange={(e) => setGame({ ...game, description: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="publisher">Publisher</Label>
        <Input
          id="publisher"
          value={game.publisher || ""}
          onChange={(e) => setGame({ ...game, publisher: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Genres</Label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <Badge
              key={genre}
              variant={game.genres?.includes(genre) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() =>
                setGame({
                  ...game,
                  genres: toggleSelection(game.genres || [], genre),
                })
              }
            >
              {genre}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Platforms</Label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => (
            <Badge
              key={platform}
              variant={
                game.platforms?.includes(platform) ? "default" : "outline"
              }
              className="cursor-pointer"
              onClick={() =>
                setGame({
                  ...game,
                  platforms: toggleSelection(game.platforms || [], platform),
                })
              }
            >
              {platform}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600"
      >
        Register Game
      </Button>
    </form>
  );
}
