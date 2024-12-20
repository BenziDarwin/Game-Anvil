"use client";

import { notFound } from "next/navigation";
import ProfileHeader from "@/components/Profile/ProdileHeader";
import ProfileContent from "@/components/Profile/ProfileContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Profile/SideBar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import HammerLoader from "@/components/Loader";

export interface User {
  id: string;
  name: string;
  avatar: string;
  volume: string;
  verified: boolean;
  bio: string;
  joinedDate: string;
  collections: number;
  followers: number;
  following: number;
  location?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
}

// Dummy user data
const dummyUser: User = {
  id: "12345",
  name: "John Doe",
  avatar: "https://via.placeholder.com/150",
  volume: "1.2M",
  verified: true,
  bio: "Digital artist and NFT creator with a passion for blockchain technology.",
  joinedDate: "2022-01-15",
  collections: 8,
  followers: 12000,
  following: 150,
  location: "San Francisco, CA",
  website: "https://johndoe.com",
  twitter: "@johndoe",
  instagram: "@johndoe_art",
};

export default function ProfilePage() {
  const user = dummyUser;
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

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen">
        <ProfileHeader user={user} />
        <ProfileContent user={user} />
      </main>
    </SidebarProvider>
  );
}
