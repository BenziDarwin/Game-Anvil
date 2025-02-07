"use client";

import HammerLoader from "@/components/Loader";
import ProfileContent from "@/components/Profile/ProfileContent";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import { AppSidebar } from "@/components/Profile/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
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
        <ProfileHeader />
        <ProfileContent />
      </main>
    </SidebarProvider>
  );
}
