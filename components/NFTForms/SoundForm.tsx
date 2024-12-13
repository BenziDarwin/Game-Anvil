'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useIPFSUpload } from '@/hooks/useIPFSUpload';
import { GameList } from '@/components/GameList';
import { DraggableBox } from '@/components/DraggableBox';

interface Game {
  id: number;
  name: string;
}

interface SoundFormData {
  name: string;
  description: string;
  duration: string;
  genre?: string;
  soundType: string;
  license: string;
  composer: string;
  image?: File;
  soundFile?: File;
  compatibleGames: Game[];
}

export default function SoundForm() {
  const [formData, setFormData] = useState<SoundFormData>({
    name: '',
    description: '',
    duration: '',
    soundType: '',
    license: '',
    composer: '',
    compatibleGames: [],
  });
  
  const { uploadToIPFS, isUploading } = useIPFSUpload();

  const handleSoundFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const ipfsHash = await uploadToIPFS(file);
        console.log('Uploaded to IPFS:', ipfsHash);
        setFormData(prev => ({ ...prev, soundFile: file }));
      } catch (error) {
        console.error('Upload failed:', error);
        // Optionally add user-facing error handling
      }
    }
  };

  const handleImageUpload = (file: File) => {
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSelectedGamesChange = (selectedGame: Game| null) => {
    setFormData(prev => ({ ...prev, gameID: selectedGame?.id.toString() }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic
    console.log('Form submitted:', formData);
  };

  return (
    <div className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Upload NFT Image</h2>
              <DraggableBox onDrop={handleImageUpload} image={formData.image} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">Compatible Games</h2>
              <GameList onSelectedGameChange={handleSelectedGamesChange} />
            </div>
          </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Sound Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="soundType">Sound Type</Label>
          <Select
            value={formData.soundType}
            onValueChange={(value) => setFormData(prev => ({ ...prev, soundType: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Sound Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="music">Background Music</SelectItem>
              <SelectItem value="sfx">Sound Effect</SelectItem>
              <SelectItem value="ambient">Ambient Sound</SelectItem>
              <SelectItem value="voice">Voice Over</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="license">License</Label>
          <Select
            value={formData.license}
            onValueChange={(value) => setFormData(prev => ({ ...prev, license: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select License" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exclusive">Exclusive Rights</SelectItem>
              <SelectItem value="nonexclusive">Non-exclusive Rights</SelectItem>
              <SelectItem value="creative-commons">Creative Commons</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="composer">Composer</Label>
          <Input
            id="composer"
            value={formData.composer}
            onChange={e => setFormData(prev => ({ ...prev, composer: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="soundFile">Sound File</Label>
          <Input
            id="soundFile"
            type="file"
            accept="audio/*"
            onChange={handleSoundFileUpload}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-orange-500 hover:bg-orange-600"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Create Sound NFT'}
        </Button>
      </form>
    </div>
  );
}

