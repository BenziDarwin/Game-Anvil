"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VerifiedIcon, Users, Calendar } from "lucide-react";
import NFTGrid from "@/components/NFTGrid";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import HammerLoader from "@/components/Loader";
import { getCollection, updateDocument } from "@/firebase/firestore";
import type { UserData } from "@/lib/types/user";
import { useToast } from "@/hooks/use-toast";
import type { Followers } from "@/lib/types";
import { Notification } from "@/components/Notification";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [collector, setCollector] = useState<UserData | null>(null);
  const [followers, setFollowers] = useState<Followers | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/auth/login");
    }
  }, [currentUser, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        await Promise.all([fetchCollector(), fetchFollowers()]);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentUser, loading]);

  const fetchCollector = async () => {
    try {
      const res = await getCollection("users", [
        { field: "uid", operator: "==", value: params.id },
      ]);
      if (res && res.length > 0) {
        setCollector(res[0] as UserData);
      }
    } catch (error: any) {
      setNotification({ message: error.message, type: "error" });
    }
  };

  const fetchFollowers = async () => {
    try {
      const res = await getCollection("followers", [
        { field: "uid", operator: "==", value: params.id },
      ]);
      if (res && res.length > 0) {
        const followerData = res[0] as Followers;
        setFollowers(followerData);
        setIsFollowing(followerData.followers.includes(currentUser?.uid || ""));
      }
    } catch (error: any) {
      setNotification({ message: error.message, type: "error" });
    }
  };

  const followerHandler = async () => {
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    if (params.id === currentUser.uid) {
      setNotification({ message: "You cannot follow yourself", type: "error" });
      return;
    }

    try {
      setIsLoading(true);
      const res = await getCollection("followers", [
        { field: "uid", operator: "==", value: params.id },
      ]);
      if (res && res.length > 0) {
        const followerDoc = res[0];
        const updatedFollowers = isFollowing
          ? followerDoc.followers.filter((id: string) => id !== currentUser.uid)
          : [...followerDoc.followers, currentUser.uid];

        await updateDocument("followers", followerDoc.id, {
          followers: updatedFollowers,
        });
        setIsFollowing(!isFollowing);
        await fetchFollowers();
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      setNotification({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading && isLoading) return <HammerLoader />;

  if (!currentUser) {
    return null; // The useEffect will handle the redirect
  }

  return (
    <main className="min-h-screen">
      {/* Profile Header */}
      <div className="bg-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar className="w-32 h-32 border-4 border-white">
              <img
                src={collector?.image || "/placeholder.svg"}
                alt={collector?.name}
              />
            </Avatar>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-4xl font-bold">{collector?.name}</h1>
                {collector?.verified && <VerifiedIcon className="h-6 w-6" />}
              </div>
              <p className="mt-2 text-lg opacity-90">{collector?.bio}</p>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{followers?.followers.length || 0} followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined{" "}
                    {new Date(collector?.joinedDate || "").toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="md:ml-auto">
              <Button
                variant="secondary"
                className="bg-white text-orange-500 hover:bg-orange-50"
                onClick={followerHandler}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 bg-transparent">
        <Tabs defaultValue="collected">
          <TabsList>
            <TabsTrigger value="collected">Collected</TabsTrigger>
            <TabsTrigger value="created">Created</TabsTrigger>
          </TabsList>

          <TabsContent value="collected" className="mt-6">
            <NFTGrid category="collected" uid={params.id} />
          </TabsContent>

          <TabsContent value="created" className="mt-6">
            <NFTGrid category="created" uid={params.id} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="fixed bottom-4 right-4">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </main>
  );
}
