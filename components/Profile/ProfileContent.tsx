"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NFTGrid from "@/components/NFTGrid";
import { User } from "@/lib/types/user";
import { Layers, Users2, Wallet } from "lucide-react";

export default function ProfileContent({ user }: { user: User }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Volume Traded
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user.volume}
                  </p>
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
                  <p className="text-sm font-medium text-gray-500">
                    Collections
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user.collections}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {user.following}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="collected" className="space-y-8">
        <TabsList className="shadow-md rounded-lg p-1 bg-transparent">
          <TabsTrigger value="collected" className="rounded-md px-4 py-2">
            Collected
          </TabsTrigger>
          <TabsTrigger value="created" className="rounded-md px-4 py-2">
            Created
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="collected"
          className="rounded-lg p-6 bg-transparent"
        >
          <NFTGrid category="collected" />
        </TabsContent>

        <TabsContent value="created" className="rounded-lg p-6 bg-transparent">
          <NFTGrid category="created" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
