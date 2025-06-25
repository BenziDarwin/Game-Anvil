"use client";

import HammerLoader from "@/components/Loader";
import NftForm from "@/components/NFTForms/nftForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import GameNFT from "@/contracts/GameNFT.json";
import { addDocument } from "@/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { deployContract } from "@/utils/ethereum";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Palette,
  Plus,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/auth/login");
    }
  }, [currentUser, loading, router]);

  if (loading) return <HammerLoader />;
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-orange-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Unauthorized Access</h2>
            <p className="text-gray-600 text-center mb-4">
              You need to be logged in to access this page.
            </p>
            <div className="text-sm text-gray-500">Redirecting to login...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateCollection = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsCreatingCollection(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const symbol = formData.get("symbol") as string;
    const name = formData.get("name") as string;

    try {
      // Deploy the contract
      const private_key = process.env.NEXT_PUBLIC_PRIVATE_KEY;
      const chainRPC = process.env.NEXT_PUBLIC_CHAIN_RPC;
      const contract = await deployContract(
        private_key!,
        GameNFT.abi,
        GameNFT.bytecode,
        chainRPC!,
        [name, symbol],
      );
      const address = await contract.getAddress();
      const chain = Number(contract.deploymentTransaction()?.chainId || null);
      const documentData = {
        name,
        symbol,
        address,
        creator: currentUser.uid,
        chain: chain,
        createdAt: new Date().toISOString(),
      };
      await addDocument("collections", documentData);

      toast({
        title: "Collection Created Successfully!",
        description: `Your collection "${name}" has been deployed and is ready to use.`,
      });

      setIsDialogOpen(false);
      // Reset form
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      const errorMessage =
        "An error occurred while deploying the contract. Please try again.";
      setError(errorMessage);
      toast({
        title: "Collection Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });

      // Clear error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsCreatingCollection(false);
    }
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden w-full bg-gray-50/50">
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-orange-500" />
              <h1 className="text-lg font-semibold">NFT Creator Studio</h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-6 space-y-8">
              {/* Hero Section */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 p-8 text-white">
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-white/20 text-white border-white/30"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          GameAnvil Studio
                        </Badge>
                      </div>
                      <h1 className="text-4xl font-bold leading-tight">
                        Create Amazing
                        <br />
                        Gaming NFTs
                      </h1>
                      <p className="text-lg text-white/90 max-w-md">
                        Design, mint, and manage your gaming NFTs with our
                        powerful creation tools. From skins to mods, bring your
                        digital assets to life.
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="lg"
                            className="bg-white text-gray-900 hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Collection
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              </div>

              {/* Mobile Create Collection Button */}
              <div className="md:hidden">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Collection
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Collection Creation Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Main NFT Form */}
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Palette className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        NFT Creation Studio
                      </CardTitle>
                      <CardDescription className="text-base">
                        Create drafts locally, then mint when you're ready. No
                        wasted uploads.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <NftForm collectionDialog={isDialogOpen} />
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Collection Creation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreateCollection}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-500" />
                Create New Collection
              </DialogTitle>
              <DialogDescription>
                Deploy a new smart contract for your NFT collection. This will
                create a unique collection that you can mint NFTs into.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Collection Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="My Awesome Gaming Collection"
                  required
                  disabled={isCreatingCollection}
                />
                <p className="text-xs text-gray-500">
                  This will be the display name for your collection
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="symbol">Collection Symbol</Label>
                <Input
                  id="symbol"
                  name="symbol"
                  placeholder="GAME"
                  required
                  disabled={isCreatingCollection}
                  className="uppercase"
                  maxLength={10}
                />
                <p className="text-xs text-gray-500">
                  Short identifier (2-10 characters, e.g., GAME, SKIN)
                </p>
              </div>
              {error && (
                <Alert variant="destructive" className="text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isCreatingCollection}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingCollection}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isCreatingCollection ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Create Collection
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
