"use client";

import { create } from "@web3-storage/w3up-client";
import { useState } from "react";
import { encryptFile, generateKey } from "@/actions/encryptFile";

export const useIPFSUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeClient = async () => {
    const client = await create();
    const account = await client.login("ssalibenjamin0402@gmail.com");
    await client.setCurrentSpace(
      process.env.NEXT_PUBLIC_IPFS_SPACE! as `did:${string}:${string}`,
    );
    await account.plan.wait();
    return { client, account };
  };

  const ipfsUpload = async (file: File): Promise<string> => {
    const { client } = await initializeClient();
    try {
      const cid = await client.uploadFile(file);
      console.log("Uploaded file CID:", cid);
      return cid.toString();
    } catch (err) {
      console.error("Upload error:", err);
      throw new Error("Failed to upload to IPFS");
    }
  };

  const uploadToIPFS = async (
    file: File,
  ): Promise<{ ipfs: string; key: Uint8Array }> => {
    setIsUploading(true);
    setError(null);

    try {
      const key = generateKey();
      const encryptedFile = await encryptFile(file, key);
      const ipfsResponse = await ipfsUpload(encryptedFile);

      return { ipfs: ipfsResponse, key };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload to IPFS";
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadToIPFSNoEncryption = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);

    try {
      const ipfsResponse = await ipfsUpload(file);
      return ipfsResponse;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload to IPFS";
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadToIPFS, uploadToIPFSNoEncryption, isUploading, error };
};
