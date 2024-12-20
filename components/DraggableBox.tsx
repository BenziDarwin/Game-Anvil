"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface DraggableBoxProps {
  onDrop: (file: File) => void;
  image?: File | string;
}

export function DraggableBox({ onDrop, image }: DraggableBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof image === "string") {
      setPreviewUrl(image);
    }
  }, [image]);

  useEffect(() => {
    const div = dropRef.current;
    if (!div) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          onDrop(file);
        } else {
          alert("Please drop an image file.");
        }
      }
    };

    div.addEventListener("dragover", handleDragOver);
    div.addEventListener("dragleave", handleDragLeave);
    div.addEventListener("drop", handleDrop);

    return () => {
      div.removeEventListener("dragover", handleDragOver);
      div.removeEventListener("dragleave", handleDragLeave);
      div.removeEventListener("drop", handleDrop);
    };
  }, [onDrop]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onDrop(e.target.files[0]);
    }
  };

  return (
    <div
      ref={dropRef}
      onClick={handleClick}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      {previewUrl ? (
        <div className="relative w-full h-48">
          <Image
            src={previewUrl}
            alt="Uploaded NFT image"
            layout="fill"
            objectFit="contain"
          />
        </div>
      ) : (
        <p>Drag and drop your NFT image here, or click to select</p>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  );
}
