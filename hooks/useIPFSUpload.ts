"use client";

import { create } from "@web3-storage/w3up-client";
import { useState } from "react";
import { encryptFile, generateKey } from "@/actions/encryptFile";

interface IPFSResponse {
  cid: string;
  size: number;
}

export const useIPFSUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeClient = async () => {
    const client = await create();
    const account = await client.login("your-email@example.com"); // Replace with your email
    await account.plan.wait(); // Wait for a payment plan to be selected
    return client;
  };

  const ipfsUpload = async (file: File): Promise<IPFSResponse> => {
    const client = await initializeClient();
    const account = await client.login("ssalibenjamin0402@gmail.com"); // Replace with your email
    const space = await client.createSpace("GameAnvil", { account });

    try {
      const cid = await client.uploadFile(file);
      console.log("Uploaded file CID:", cid);

      return {
        cid: cid.toString(),
        size: 0, // Size is not directly available in w3up-client
      };
    } catch (err) {
      console.error("Upload error:", err);
      throw new Error("Failed to upload to IPFS");
    }
  };

  const uploadToIPFS = async (
    file: File,
  ): Promise<{ ipfs: IPFSResponse; key: Uint8Array }> => {
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
      return ipfsResponse.cid;
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
