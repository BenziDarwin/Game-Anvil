"use client";

import { notFound } from "next/navigation";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileContent from "@/components/Profile/ProfileContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Profile/SideBar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import HammerLoader from "@/components/Loader";
import { UserData } from "@/lib/types/user";

// Dummy user data
const dummyUser: UserData = {
  id: "12345",
  name: "John Doe",

  verified: true,
  bio: "Digital artist and NFT creator with a passion for blockchain technology.",
  joinedDate: "2022-01-15",
  email: "example@gmail.com",
  location: "San Francisco, CA",
  website: "https://johndoe.com",
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
