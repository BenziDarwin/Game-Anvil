"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { User } from "@/lib/types/user";
import { useAuth } from "@/context/AuthContext";
import HammerLoader from "@/components/Loader";

// In a real app, you'd fetch the user data here
const mockUser: User = {
  id: "1",
  name: "GameMaster",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
  volume: "1,234.56 ETH",
  verified: true,
  bio: "Passionate game collector and trader. Specializing in rare skins and items.",
  joinedDate: "January 2024",
  collections: 45,
  followers: 1234,
  following: 567,
  location: "New York, USA",
  website: "https://gamemaster.com",
  twitter: "@gamemaster",
  instagram: "@gamemaster_nft",
};

export default function EditProfilePage() {
  const [user, setUser] = useState<User>(mockUser);
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/auth/login");
    }
  }, [currentUser, loading]);

  if (loading) return <HammerLoader />;
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Unauthorized - Redirecting to login...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send the updated user data to your API here
    console.log("Updated user:", user);
    router.push(`/profile/${user.id}`);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white py-12">
      <Card className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-orange-500 text-white p-6">
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="rounded-full"
                />
              </Avatar>
              <Button
                type="button"
                variant="outline"
                className="text-orange-500 border-orange-500 hover:bg-orange-50"
              >
                Change Avatar
              </Button>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="text-sm font-medium text-gray-700"
              >
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={user.bio}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-sm font-medium text-gray-700"
              >
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={user.location}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="website"
                className="text-sm font-medium text-gray-700"
              >
                Website
              </Label>
              <Input
                id="website"
                name="website"
                value={user.website}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="twitter"
                className="text-sm font-medium text-gray-700"
              >
                Twitter
              </Label>
              <Input
                id="twitter"
                name="twitter"
                value={user.twitter}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="instagram"
                className="text-sm font-medium text-gray-700"
              >
                Instagram
              </Label>
              <Input
                id="instagram"
                name="instagram"
                value={user.instagram}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="text-orange-500 border-orange-500 hover:bg-orange-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
