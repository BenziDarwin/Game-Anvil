"use client";

import { encryptFile, generateKey } from "@/actions/encryptFile";
import { useState } from "react";

interface IPFSResponse {
  cid: string;
  size: number;
}

const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

export const useIPFSUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ipfsUpload = async (data: ArrayBuffer): Promise<IPFSResponse> => {
    if (!pinataApiKey || !pinataSecretKey) {
      throw new Error("Pinata credentials not configured");
    }

    const formData = new FormData();
    const blob = new Blob([data]);
    formData.append("file", blob);

    try {
      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretKey,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        cid: result.IpfsHash,
        size: result.PinSize,
      };
    } catch (err) {
      console.error("Pinata upload error:", err);
      if (err instanceof Error && err.message.includes("401")) {
        throw new Error(
          "Pinata authentication failed - check your credentials",
        );
      }
      throw new Error("Failed to upload to Pinata");
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
      const arrayBuffer = await encryptedFile.arrayBuffer();
      //const ipfsResponse = await ipfsUpload(arrayBuffer);
      const ipfsResponse = { cid: "Your hash", size: 45 };

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
      const arrayBuffer = await file.arrayBuffer();

      //const ipfsResponse = await ipfsUpload(arrayBuffer);
      const ipfsResponse = "Your plain hash";

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
