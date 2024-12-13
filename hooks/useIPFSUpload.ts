'use client';

import { useState } from 'react';

export const useIPFSUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadToIPFS = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);
    
    try {
      // Mock IPFS upload - In production, implement actual IPFS upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockIPFSHash = `ipfs://Qm${Math.random().toString(36).substring(2, 15)}`;
      return mockIPFSHash;
    } catch (err) {
      setError('Failed to upload to IPFS');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadToIPFS, isUploading, error };
};