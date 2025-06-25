"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/firebase/config";
import { addDocument, getCollection } from "@/firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { useIPFSUpload } from "@/hooks/useIPFSUpload";
import { getEthereumContract } from "@/utils/ethereum";
import GameNFT from "@/contracts/GameNFT.json";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import type { NFT } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useDrafts } from "@/hooks/use-drafts";
import NFTCreationForm from "@/components/NFTForms/nftCreationForm";
import { DraftsList } from "@/components/NFTForms/draftsList";
import type { Collection, DraftNFT } from "@/types/drafts";
import ProgressBar from "@/components/NFTForms/progressBar";

export default function NftForm({
  collectionDialog,
}: {
  collectionDialog: boolean;
}) {
  const { toast } = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);
  const { uploadToIPFS, uploadToIPFSNoEncryption } = useIPFSUpload();
  const router = useRouter();
  const [progressState, setProgressState] = useState({
    isVisible: false,
    currentStep: "",
    progress: 0,
    step: 0,
    totalSteps: 5,
  });

  const {
    drafts,
    loading: draftsLoading,
    saveDraft,
    updateDraft,
    deleteDraft,
    getFiles,
    setFiles,
  } = useDrafts();

  const fetchCollections = useCallback(async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const collections = await getCollection("collections", [
        { field: "creator", operator: "==", value: currentUser.uid },
      ]);
      setCollections(
        collections.map((doc: any) => ({
          address: doc.address,
          name: doc.name,
          symbol: doc.symbol,
        })),
      );
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast({
        title: "Error",
        description: "Error fetching collections",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections, collectionDialog]);

  const updateProgress = useCallback(
    (step: number, currentStep: string, percentage: number) => {
      setProgressState({
        isVisible: true,
        currentStep,
        progress: percentage,
        step,
        totalSteps: 5,
      });
    },
    [],
  );

  const createNFT = useCallback(
    async (tokenURI: string, contractAddress: string, creationFee: string) => {
      try {
        const abi = GameNFT.abi;
        const contract = await getEthereumContract(contractAddress, abi);

        const transaction = await contract.createNFT(tokenURI, {
          value: ethers.parseEther(creationFee),
        });

        const receipt = await transaction.wait();

        const iface = new ethers.Interface(abi);
        let tokenId: string | undefined;

        for (const log of receipt.logs) {
          try {
            const parsedLog = iface.parseLog(log);
            if (parsedLog && parsedLog.name === "NFTCreated") {
              tokenId = parsedLog.args.tokenId.toString();
              break;
            }
          } catch (error) {
            // Ignore logs that don't match ABI events
          }
        }

        if (!tokenId) {
          throw new Error("Failed to retrieve Token ID from event");
        }

        return tokenId;
      } catch (error) {
        console.error("Error creating NFT:", error);
        throw error;
      }
    },
    [],
  );

  const handleSubmitDraft = useCallback(
    async (draft: DraftNFT) => {
      console.log("Submitting draft:", draft.id);

      if (!draft.id) {
        toast({
          title: "Error",
          description: "Draft ID is missing.",
          variant: "destructive",
        });
        return;
      }

      const files = getFiles(draft.id);

      if (!window.ethereum) {
        toast({
          title: "Error",
          description: "Ethereum provider not found. Please install MetaMask.",
          variant: "destructive",
        });
        return;
      }

      if (!files.imageFile || !files.gameFile) {
        toast({
          title: "Error",
          description:
            "Files not found. Please edit the draft and re-upload files.",
          variant: "destructive",
        });
        return;
      }

      try {
        // Update draft status and show progress
        await updateDraft(draft.id, {
          status: "uploading",
          progress: {
            step: 1,
            totalSteps: 5,
            currentStep: "Uploading image to IPFS...",
            percentage: 20,
          },
        });

        updateProgress(1, "Uploading image to IPFS...", 20);

        // Step 1: Upload image
        const imageHash = await uploadToIPFSNoEncryption(files.imageFile);
        const imageUrl = `https://${imageHash}.ipfs.w3s.link`;

        // Step 2: Upload game file
        await updateDraft(draft.id, {
          progress: {
            step: 2,
            totalSteps: 5,
            currentStep: "Uploading game file to IPFS...",
            percentage: 40,
          },
        });
        updateProgress(2, "Uploading game file to IPFS...", 40);

        const { ipfs: fileHash } = await uploadToIPFS(files.gameFile);
        const fileUrl = `https://${fileHash}.ipfs.w3s.link`;

        // Step 3: Create metadata
        await updateDraft(draft.id, {
          progress: {
            step: 3,
            totalSteps: 5,
            currentStep: "Creating NFT metadata...",
            percentage: 60,
          },
        });
        updateProgress(3, "Creating NFT metadata...", 60);

        const metadata = {
          meta: draft.dynamicFields,
          image: imageUrl,
          file: fileUrl,
          description: draft.description,
          type: draft.nftType,
        };

        const jsonData = JSON.stringify(metadata, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const metadataFile = new File([blob], "metadata.json", {
          type: "application/json",
        });

        const metadataHash = await uploadToIPFSNoEncryption(metadataFile);
        const tokenURI = `https://${metadataHash}.ipfs.w3s.link`;

        // Step 4: Create NFT
        await updateDraft(draft.id, {
          progress: {
            step: 4,
            totalSteps: 5,
            currentStep: "Minting NFT on blockchain...",
            percentage: 80,
          },
        });
        updateProgress(4, "Minting NFT on blockchain...", 80);

        const tokenId = await createNFT(tokenURI, draft.collection, "0.005");

        if (tokenId) {
          // Step 5: Save to database
          await updateDraft(draft.id, {
            progress: {
              step: 5,
              totalSteps: 5,
              currentStep: "Saving NFT to database...",
              percentage: 100,
            },
          });
          updateProgress(5, "Saving NFT to database...", 100);

          const nft: NFT = {
            title: draft.name,
            description: draft.description,
            creator: auth.currentUser!.uid,
            price: "0.005",
            image: imageUrl,
            collection: draft.collection,
            category: draft.nftType,
            created: new Date().toISOString(),
            tokenId: tokenId,
          };

          await addDocument("nfts", nft);
          await updateDraft(draft.id, { status: "completed" });

          setProgressState((prev) => ({ ...prev, isVisible: false }));

          toast({
            title: "NFT Created Successfully!",
            description: `Your NFT "${draft.name}" has been created and is now available.`,
          });

          router.push("/profile");
        }
      } catch (error) {
        console.error("Error in NFT creation:", error);
        await updateDraft(draft.id, { status: "failed" });
        setProgressState((prev) => ({ ...prev, isVisible: false }));
        toast({
          title: "NFT Creation Failed",
          description:
            "There was an error creating your NFT. Please try again.",
          variant: "destructive",
        });
      }
    },
    [
      updateDraft,
      uploadToIPFSNoEncryption,
      uploadToIPFS,
      createNFT,
      toast,
      router,
      getFiles,
      updateProgress,
    ],
  );

  const handleDeleteDraft = useCallback(
    async (id: string) => {
      try {
        await deleteDraft(id);
        toast({
          title: "Draft Deleted",
          description: "Your NFT draft has been deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete draft.",
          variant: "destructive",
        });
      }
    },
    [deleteDraft, toast],
  );

  const handleUpdateDraft = useCallback(
    async (
      id: string,
      updates: Partial<DraftNFT>,
      files?: { imageFile?: File; gameFile?: File },
    ) => {
      try {
        await updateDraft(id, updates);
        if (files) {
          setFiles(id, files);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update draft.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [updateDraft, setFiles, toast],
  );

  const handleSaveDraft = useCallback(
    async (
      draftData: Omit<DraftNFT, "id" | "createdAt" | "status" | "userId">,
      files: { imageFile?: File; gameFile?: File },
    ) => {
      try {
        const draftId = await saveDraft(draftData, files);
        console.log("Draft saved with ID:", draftId);
        return draftId;
      } catch (error) {
        console.error("Error saving draft:", error);
        toast({
          title: "Error",
          description: "Failed to save draft.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [saveDraft, toast],
  );

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="create">Create NFT</TabsTrigger>
            <TabsTrigger value="drafts" className="relative">
              Drafts
              {drafts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {drafts.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <NFTCreationForm
              collections={collections}
              onSaveDraft={handleSaveDraft}
            />
          </TabsContent>

          <TabsContent value="drafts">
            <DraftsList
              drafts={drafts}
              collections={collections}
              loading={draftsLoading}
              onSubmitDraft={handleSubmitDraft}
              onDeleteDraft={handleDeleteDraft}
              onUpdateDraft={handleUpdateDraft}
              getFiles={getFiles}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ProgressBar
        isVisible={progressState.isVisible}
        currentStep={progressState.currentStep}
        progress={progressState.progress}
        step={progressState.step}
        totalSteps={progressState.totalSteps}
      />
    </>
  );
}
