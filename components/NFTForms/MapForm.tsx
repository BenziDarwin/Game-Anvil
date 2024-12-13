'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useIPFSUpload } from '@/hooks/useIPFSUpload';
import { DraggableBox } from '../DraggableBox';
import { GameList } from '../GameList';

interface Game {
  id: number;
  name: string;
}


export default function MapForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mapType: '',
    size: '',
    playerCount: '',
    difficulty: '',
    features: '',
    image: null as File | null,
  });
  
  const { uploadToIPFS, isUploading } = useIPFSUpload();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ipfsHash = await uploadToIPFS(file);
      console.log('Uploaded to IPFS:', ipfsHash);
    }
  };
  const handleImageUpload = (file: File) => {
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSelectedGamesChange = (selectedGame: Game| null) => {
    setFormData(prev => ({ ...prev, gameID: selectedGame?.id.toString() }));
  };
  return (
       <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-8">
                    <div>
                      <h2 className="text-xl font-bold mb-4">Upload NFT Image</h2>
                      <DraggableBox onDrop={handleImageUpload} image={formData.image || undefined} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-4">Compatible Games</h2>
                      <GameList onSelectedGameChange={handleSelectedGamesChange} />
                    </div>
                  </div>
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Map Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mapType">Map Type</Label>
        <Select
          value={formData.mapType}
          onValueChange={value => setFormData({ ...formData, mapType: value })}
        >
                  <SelectTrigger>
            <SelectValue placeholder="Select  Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pvp">PvP Arena</SelectItem>
            <SelectItem value="adventure">Adventure</SelectItem>
            <SelectItem value="racing">Racing</SelectItem>
            <SelectItem value="survival">Survival</SelectItem>
            <SelectItem value="puzzle">Puzzle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Map Size</Label>
        <Select
          value={formData.size}
          onValueChange={value => setFormData({ ...formData, size: value })}
        >
                  <SelectTrigger>
                      <SelectValue placeholder="Select Size" />
                    </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
            <SelectItem value="massive">Massive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="playerCount">Player Count</Label>
        <Input
          id="playerCount"
          value={formData.playerCount}
          onChange={e => setFormData({ ...formData, playerCount: e.target.value })}
          placeholder="e.g., 2-16"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select
          value={formData.difficulty}
          onValueChange={value => setFormData({ ...formData, difficulty: value })}
        >
                  <SelectTrigger>
                      <SelectValue placeholder="Select Difficulty" />
                    </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Key Features</Label>
        <Textarea
          id="features"
          value={formData.features}
          onChange={e => setFormData({ ...formData, features: e.target.value })}
          placeholder="List the main features of your map"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Map File</Label>
        <Input
          id="file"
          type="file"
          accept=".zip,.rar,.7z"
          onChange={handleFileUpload}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-orange-500 hover:bg-orange-600"
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Create Map NFT'}
      </Button>
    </form>
    </div>
  );
}