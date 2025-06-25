"use client";

import { useState, useEffect, useCallback } from "react";
import { auth } from "@/firebase/config";
import {
  getCollection,
  addDocument,
  updateDocument,
  deleteDocument,
} from "@/firebase/firestore";
import type { DraftNFT } from "@/types/drafts";

// Store files in memory with draft ID as key
const fileStorage = new Map<string, { imageFile?: File; gameFile?: File }>();

export function useDrafts() {
  const [drafts, setDrafts] = useState<DraftNFT[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrafts = useCallback(async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setDrafts([]);
        setLoading(false);
        return;
      }

      const fetchedDrafts = await getCollection<DraftNFT>("nft-drafts", [
        { field: "userId", operator: "==", value: currentUser.uid },
      ]);

      setDrafts(
        fetchedDrafts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (error) {
      console.error("Error fetching drafts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  const saveDraft = useCallback(
    async (
      draftData: Omit<DraftNFT, "id" | "createdAt" | "status" | "userId">,
      files: { imageFile?: File; gameFile?: File },
    ) => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("User not authenticated");

        const newDraft: Omit<DraftNFT, "id"> = {
          ...draftData,
          imageFileName: files.imageFile?.name,
          gameFileName: files.gameFile?.name,
          createdAt: new Date().toISOString(),
          status: "draft",
          userId: currentUser.uid,
        };

        // Add to Firebase first to get the real ID
        const docRef = await addDocument("nft-drafts", newDraft);

        // Store files with the actual document ID
        if (docRef && files) {
          fileStorage.set(docRef, files);
        }

        await fetchDrafts();
        return docRef;
      } catch (error) {
        console.error("Error saving draft:", error);
        throw error;
      }
    },
    [fetchDrafts],
  );

  const updateDraft = useCallback(
    async (id: string, updates: Partial<DraftNFT>) => {
      try {
        const updateData = {
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        await updateDocument("nft-drafts", id, updateData);

        // Update local state immediately
        setDrafts((prev) =>
          prev.map((draft) =>
            draft.id === id ? { ...draft, ...updateData } : draft,
          ),
        );
      } catch (error) {
        console.error("Error updating draft:", error);
        throw error;
      }
    },
    [],
  );

  const deleteDraft = useCallback(async (id: string) => {
    try {
      await deleteDocument("nft-drafts", id);
      fileStorage.delete(id);
      setDrafts((prev) => prev.filter((draft) => draft.id !== id));
    } catch (error) {
      console.error("Error deleting draft:", error);
      throw error;
    }
  }, []);

  const getDraft = useCallback(
    (id: string) => {
      return drafts.find((draft) => draft.id === id);
    },
    [drafts],
  );

  const getFiles = useCallback((id: string) => {
    return fileStorage.get(id) || {};
  }, []);

  const setFiles = useCallback(
    (id: string, files: { imageFile?: File; gameFile?: File }) => {
      fileStorage.set(id, files);
    },
    [],
  );

  return {
    drafts,
    loading,
    saveDraft,
    updateDraft,
    deleteDraft,
    getDraft,
    getFiles,
    setFiles,
    refetch: fetchDrafts,
  };
}
