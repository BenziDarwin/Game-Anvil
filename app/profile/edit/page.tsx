"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { UserData } from "@/lib/types/user";
import { useAuth } from "@/context/AuthContext";
import HammerLoader from "@/components/Loader";
import { useToast } from "@/hooks/use-toast";
import { getCollection, setDocument } from "@/firebase/firestore";
import { auth, storage } from "@/firebase/config";
import { DocumentData } from "firebase/firestore";
import { LoadingDialog } from "@/components/NFTForms/LoadingDialog";
import { set } from "date-fns";
import { deleteFile, uploadFile } from "@/cloudfare/storage";

export default function EditProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const { currentUser, loading } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/auth/login");
    }
  }, [currentUser, loading]);

  useEffect(() => {
    if (currentUser) {
      fetchUser();
    }
  }, [currentUser]);

  const fetchUser = async () => {
    try {
      let res = await getCollection("users", [
        { field: "uid", operator: "==", value: auth.currentUser?.uid! },
      ]);
      if (res !== null && res.length > 0) {
        setUser(res[0] as UserData);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDataLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!avatar) return;
    setUploading(true);
    if (user?.image) {
      try {
        console.log("Deleting old image");
        await deleteFile(user.image);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
    const downloadURL = await uploadFile(`avatars/${currentUser?.uid}`, avatar);
    setUploading(false);
    setUser({ ...user, image: downloadURL } as UserData);
    return downloadURL;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = user?.image;
    if (avatar) {
      imageUrl = await handleImageUpload();
    }
    try {
      await setDocument("users", user?.id!, {
        ...user,
        image: imageUrl,
      } as DocumentData);
      router.push("/profile");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (user) {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  if (loading) return <HammerLoader />;
  if (dataLoading) return <div>Loading...</div>;
  if (!currentUser)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Unauthorized - Redirecting to login...
      </div>
    );

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
                  src={user?.image}
                  alt={user?.name}
                  className="rounded-full"
                />
              </Avatar>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              />
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
                value={user?.name || ""}
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
                value={user?.bio || ""}
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
                disabled={uploading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <LoadingDialog
        isOpen={uploading}
        message="Uploading image, please wait..."
      />
    </div>
  );
}
