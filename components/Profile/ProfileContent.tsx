'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import NFTGrid from '@/components/NFTGrid'
import { User } from '@/lib/types/user'
import { Layers, Users2, Wallet } from 'lucide-react'

export default function ProfileContent({ user }: { user: User }) {
    const [selectedCategory, setSelectedCategory] = useState('all')
  
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wallet className="h-8 w-8 text-orange-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Volume Traded</p>
                    <p className="text-2xl font-bold text-gray-900">{user.volume}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Layers className="h-8 w-8 text-orange-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Collections</p>
                    <p className="text-2xl font-bold text-gray-900">{user.collections}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users2 className="h-8 w-8 text-orange-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Following</p>
                    <p className="text-2xl font-bold text-gray-900">{user.following}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
  
        <Tabs defaultValue="collected" className="space-y-8">
          <TabsList className="bg-white shadow-md rounded-lg p-1">
            <TabsTrigger value="collected" className="rounded-md px-4 py-2">Collected</TabsTrigger>
            <TabsTrigger value="created" className="rounded-md px-4 py-2">Created</TabsTrigger>
            <TabsTrigger value="activity" className="rounded-md px-4 py-2">Activity</TabsTrigger>
          </TabsList>
  
          <TabsContent value="collected" className="bg-white rounded-lg p-6">
            <NFTGrid category={selectedCategory} />
          </TabsContent>
  
          <TabsContent value="created" className="bg-white  rounded-lg p-6">
            <NFTGrid category={selectedCategory} />
          </TabsContent>
  
          <TabsContent value="activity" className="bg-white rounded-lg p-6">
            {/* Add an activity feed component here */}
            <p className="text-gray-600">User activity feed coming soon...</p>
          </TabsContent>
        </Tabs>
      </div>
    )
  }