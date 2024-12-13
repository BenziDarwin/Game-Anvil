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

export default function AnimationForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    animationType: '',
    duration: '',
    frameRate: '',
    format: '',
    rigging: '',
    compatibility: '',
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
        <Label htmlFor="name">Animation Name</Label>
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
        <Label htmlFor="animationType">Animation Type</Label>
        <Select
          value={formData.animationType}
          onValueChange={value => setFormData({ ...formData, animationType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="character">Character Animation</SelectItem>
            <SelectItem value="effect">Special Effect</SelectItem>
            <SelectItem value="environment">Environmental</SelectItem>
            <SelectItem value="cutscene">Cutscene</SelectItem>
            <SelectItem value="ui">UI Animation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          value={formData.duration}
          onChange={e => setFormData({ ...formData, duration: e.target.value })}
          placeholder="e.g., 2.5s"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="frameRate">Frame Rate</Label>
        <Input
          id="frameRate"
          value={formData.frameRate}
          onChange={e => setFormData({ ...formData, frameRate: e.target.value })}
          placeholder="e.g., 60 fps"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="format">Animation Format</Label>
        <Select
          value={formData.format}
          onValueChange={value => setFormData({ ...formData, format: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fbx">FBX</SelectItem>
            <SelectItem value="gltf">GLTF</SelectItem>
            <SelectItem value="unity">Unity Animation</SelectItem>
            <SelectItem value="unreal">Unreal Animation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rigging">Rigging Information</Label>
        <Textarea
          id="rigging"
          value={formData.rigging}
          onChange={e => setFormData({ ...formData, rigging: e.target.value })}
          placeholder="Describe the rigging system and requirements"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="compatibility">Engine Compatibility</Label>
        <Textarea
          id="compatibility"
          value={formData.compatibility}
          onChange={e => setFormData({ ...formData, compatibility: e.target.value })}
          placeholder="List compatible game engines and versions"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Animation File</Label>
        <Input
          id="file"
          type="file"
          accept=".fbx,.gltf,.glb,.anim"
          onChange={handleFileUpload}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-orange-500 hover:bg-orange-600"
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Create Animation NFT'}
      </Button>
    </form>
    </div>
  );
}