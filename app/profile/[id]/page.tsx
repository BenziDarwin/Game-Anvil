'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VerifiedIcon, Users, Calendar } from 'lucide-react';
import NFTGrid from '@/components/NFTGrid';
import { Collector } from '@/lib/types';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - In a real app, fetch based on params.id
  const collector: Collector = {
    id: params.id,
    name: 'GameMaster',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    volume: '1,234.56 ETH',
    verified: true,
    bio: 'Passionate game collector and trader. Specializing in rare skins and items.',
    joinedDate: 'January 2024',
    collections: 45,
    followers: 1234,
    following: 567,
  };

  return (
    <main className="min-h-screen">
      {/* Profile Header */}
      <div className="bg-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar className="w-32 h-32 border-4 border-white">
              <img src={collector.avatar} alt={collector.name} />
            </Avatar>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-4xl font-bold">{collector.name}</h1>
                {collector.verified && <VerifiedIcon className="h-6 w-6" />}
              </div>
              <p className="mt-2 text-lg opacity-90">{collector.bio}</p>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{collector.followers} followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {collector.joinedDate}</span>
                </div>
              </div>
            </div>
            <div className="md:ml-auto">
              <Button variant="secondary" className="bg-white text-orange-500 hover:bg-orange-50">
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <Tabs defaultValue="collected">
          <TabsList>
            <TabsTrigger value="collected">Collected</TabsTrigger>
            <TabsTrigger value="created">Created</TabsTrigger>
            <TabsTrigger value="favorited">Favorited</TabsTrigger>
          </TabsList>

          <TabsContent value="collected" className="mt-6">
            <NFTGrid category={selectedCategory} />
          </TabsContent>

          <TabsContent value="created" className="mt-6">
            <NFTGrid category={selectedCategory} />
          </TabsContent>

          <TabsContent value="favorited" className="mt-6">
            <NFTGrid category={selectedCategory} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}