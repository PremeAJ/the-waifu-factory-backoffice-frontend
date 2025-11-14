"use client";

import React, { useMemo, useState } from "react";
import MuiAvatar, { AvatarProps as MuiAvatarProps } from "@mui/material/Avatar";
import type { SxProps, Theme } from "@mui/material/styles";
import BaseLightBox, { LightboxItem } from "./BaseLightBox";

export type BaseAvatarProps = Omit<MuiAvatarProps, "src" | "alt" | "sx" | "onClick"> & {
  src?: string;
  alt?: string;
  size?: number;
  lightbox?: boolean;
  caption?: string;
  showCounter?: boolean;
  sx?: SxProps<Theme>;
  stopPropagationOnLightbox?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const BaseAvatar: React.FC<BaseAvatarProps> = ({
  src,
  alt,
  size = 35,
  lightbox = false,
  caption,
  showCounter = false,
  sx,
  stopPropagationOnLightbox = true,
  onClick,
  ...rest
}) => {
  const [open, setOpen] = useState(false);

  const items = useMemo<LightboxItem[]>(() => {
    const safeSrc = src || "";
    return safeSrc
      ? [{ src: safeSrc, alt: alt || "avatar", caption: caption || alt || "" }]
      : [];
  }, [src, alt, caption]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (lightbox && items.length > 0) {
      if (stopPropagationOnLightbox) e.stopPropagation();
      setOpen(true);
      return;
    }
    onClick?.(e);
  };

  return (
    <>
      <MuiAvatar
        src={src}
        alt={alt}
        onClick={handleClick}
        sx={{ width: size, height: size, cursor: lightbox ? "zoom-in" : "pointer", ...(sx as any) }}
        {...rest}
      />
      <BaseLightBox
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        currentIndex={0}
        showCounter={showCounter}
      />
    </>
  );
};

export default BaseAvatar;