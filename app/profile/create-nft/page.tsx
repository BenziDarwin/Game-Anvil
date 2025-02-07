"use client";

import HammerLoader from "@/components/Loader";
import NFTForms from "@/components/NFTForms";
import { AppSidebar } from "@/components/Profile/SideBar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import GameNFT from "@/contracts/GameNFT.json";
import { addDocument } from "@/firebase/firestore";
import { deployContract } from "@/utils/ethereum";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to store the error message
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

  const handleCreateCollection = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const symbol = formData.get("symbol") as string;
    const name = formData.get("name") as string;
    try {
      // Deploy the contract
      const private_key = process.env.NEXT_PUBLIC_PRIVATE_KEY;
      const contract = await deployContract(
        private_key!,
        GameNFT.abi,
        GameNFT.bytecode,
        "http://127.0.0.1:7545",
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
    } catch (error) {
      console.error(error);
      setError(
        "An error occurred while deploying the contract. Please try again.",
      ); // Set error message

      // Set a timeout to clear the error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
    setIsDialogOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-background p-8">
          <div className="mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">NFT Dashboard</h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Create Collection</Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleCreateCollection}>
                    <DialogHeader>
                      <DialogTitle>Create New Collection</DialogTitle>
                      <DialogDescription>
                        Enter the details for your new NFT collection.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="symbol" className="text-right">
                          Symbol
                        </Label>
                        <Input
                          id="symbol"
                          name="symbol"
                          placeholder="e.g. MYNFT"
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="My Awesome NFT Collection"
                          className="col-span-3"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create Collection</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="bg-card p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6">Create New NFT</h2>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <NFTForms collectionDialog={isDialogOpen} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
