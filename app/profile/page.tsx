"use client";

import HammerLoader from "@/components/Loader";
import ProfileContent from "@/components/Profile/ProfileContent";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@radix-ui/react-separator";
import { User } from "lucide-react";
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
    <>
      <main className="min-h-screen">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            <h1 className="text-lg font-semibold">Profile Menu</h1>
          </div>
        </header>
        <ProfileHeader />
        <ProfileContent />
      </main>
    </>
  );
}
