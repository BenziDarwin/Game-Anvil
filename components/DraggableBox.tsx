import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface DraggableBoxProps {
  onDrop: (file: File) => void;
  image?: File | string;
  disabled?: boolean;
}

export function DraggableBox({
  onDrop,
  image,
  disabled = false,
}: DraggableBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const dropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(image);
    } else if (typeof image === "string") {
      setPreviewUrl(image);
    }
  }, [image]);

  useEffect(() => {
    const div = dropRef.current;
    if (!div) return;

    const handleDragOver = (e: DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      if (disabled) return;
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
  }, [onDrop, disabled]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onDrop(file);
    } else {
      alert("Please select an image file.");
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div
      ref={dropRef}
      onClick={handleClick}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {previewUrl ? (
        <div className="relative w-full h-48">
          <Image
            src={previewUrl || "/placeholder.svg"}
            alt="Uploaded NFT image"
            layout="fill"
            objectFit="contain"
          />
        </div>
      ) : (
        <p>
          {disabled
            ? "Image upload disabled"
            : "Drag and drop your NFT image here, or click to select"}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
        disabled={disabled}
      />
    </div>
  );
}
