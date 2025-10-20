"use client";
import React, { useEffect, useState } from "react";
import BaseLightBox, { LightboxItem } from "../BaseLightBox";
import { UploadedFile } from "./types";

interface FileLightboxProps {
  open: boolean;
  onClose: () => void;
  imageFiles: UploadedFile[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

const FileLightbox: React.FC<FileLightboxProps> = ({
  open,
  onClose,
  imageFiles,
  currentIndex,
  onPrev,
  onNext,
}) => {
  const [items, setItems] = useState<LightboxItem[]>([]);

  useEffect(() => {
    const created: string[] = [];
    const mapped: LightboxItem[] = imageFiles.map((f) => {
      let src = f.url || "";
      if (!src && f.file instanceof File) {
        src = URL.createObjectURL(f.file);
        created.push(src);
      }
      return {
        src,
        alt: f.originName || f.file.name || "image",
        caption: f.originName || f.file.name || "image",
      };
    });

    setItems(mapped);
    return () => {
      created.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [imageFiles]);

  return (
    <BaseLightBox
      open={open}
      onClose={onClose}
      items={items}
      currentIndex={currentIndex}
      onPrev={onPrev}
      onNext={onNext}
      showCounter
    />
  );
};

export default FileLightbox;