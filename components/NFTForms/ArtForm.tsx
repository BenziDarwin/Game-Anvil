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

export default function ArtForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    artType: '',
    resolution: '',
    style: '',
    artist: '',
    usage: '',
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
        <Label htmlFor="name">Artwork Name</Label>
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
        <Label htmlFor="artType">Art Type</Label>
        <Select
          value={formData.artType}
          onValueChange={value => setFormData({ ...formData, artType: value })}
        >
            <SelectTrigger>
                      <SelectValue placeholder="Select Art Type" />
                    </SelectTrigger>
          <SelectContent>
            <SelectItem value="concept">Concept Art</SelectItem>
            <SelectItem value="character">Character Design</SelectItem>
            <SelectItem value="environment">Environment Art</SelectItem>
            <SelectItem value="promotional">Promotional Art</SelectItem>
            <SelectItem value="ui">UI/UX Art</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="style">Art Style</Label>
        <Select
          value={formData.style}
          onValueChange={value => setFormData({ ...formData, style: value })}
        >
            <SelectTrigger>
                      <SelectValue placeholder="Select Art Type" />
                    </SelectTrigger>
          <SelectContent>
            <SelectItem value="realistic">Realistic</SelectItem>
            <SelectItem value="cartoon">Cartoon</SelectItem>
            <SelectItem value="pixel">Pixel Art</SelectItem>
            <SelectItem value="anime">Anime</SelectItem>
            <SelectItem value="abstract">Abstract</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resolution">Resolution</Label>
        <Input
          id="resolution"
          value={formData.resolution}
          onChange={e => setFormData({ ...formData, resolution: e.target.value })}
          placeholder="e.g., 1920x1080"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="artist">Artist Name</Label>
        <Input
          id="artist"
          value={formData.artist}
          onChange={e => setFormData({ ...formData, artist: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Artwork File</Label>
        <Input
          id="file"
          type="file"
          accept=".png,.jpg,.jpeg,.gif,.psd"
          onChange={handleFileUpload}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-orange-500 hover:bg-orange-600"
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Create Art NFT'}
      </Button>
    </form>
    </div>
  );
}