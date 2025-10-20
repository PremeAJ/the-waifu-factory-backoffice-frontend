"use client";
import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import BaseDialog from "./BaseDialog";
import type { SxProps, Theme } from "@mui/material/styles";

export interface LightboxItem {
  src: string;
  alt?: string;
  caption?: string;
}

export interface BaseLightBoxProps {
  open: boolean;
  onClose: () => void;
  items: LightboxItem[];
  currentIndex?: number;
  onChangeIndex?: (index: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
  showCounter?: boolean;
  sx?: SxProps<Theme>;
}

const BaseLightBox: React.FC<BaseLightBoxProps> = ({
  open,
  onClose,
  items,
  currentIndex,
  onChangeIndex,
  onPrev,
  onNext,
  showCounter = true,
  sx,
}) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const hasExternalIndex = typeof currentIndex === "number";
  const index = hasExternalIndex ? (currentIndex as number) : internalIndex;

  useEffect(() => {
    if (!hasExternalIndex && open) setInternalIndex(0);
  }, [open, hasExternalIndex]);

  const count = items.length;
  const canNavigate = count > 1;

  const goPrev = () => {
    if (!canNavigate) return;
    if (onPrev) return onPrev();
    const next = index > 0 ? index - 1 : count - 1;
    if (onChangeIndex) onChangeIndex(next);
    else setInternalIndex(next);
  };

  const goNext = () => {
    if (!canNavigate) return;
    if (onNext) return onNext();
    const next = index < count - 1 ? index + 1 : 0;
    if (onChangeIndex) onChangeIndex(next);
    else setInternalIndex(next);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, count]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = items[index];

  const content = useMemo(() => {
    if (!current) return null;
    return (
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "auto",
          backgroundColor: "black",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        {canNavigate && (
          <IconButton
            onClick={goPrev}
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
              backgroundColor: "rgba(0,0,0,0.3)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
              zIndex: 2,
            }}
          >
            <IconArrowLeft />
          </IconButton>
        )}

        <Box
          component="img"
          src={current.src}
          alt={current.alt || "image"}
          sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", zIndex: 1 }}
        />

        {canNavigate && (
          <IconButton
            onClick={goNext}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
              backgroundColor: "rgba(0,0,0,0.3)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
              zIndex: 2,
            }}
          >
            <IconArrowRight />
          </IconButton>
        )}

        {(current.caption || (showCounter && count > 1)) && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              p: 1,
              textAlign: "center",
              zIndex: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "white" }}>
              {current.caption}
              {showCounter && count > 1 && ` (${index + 1}/${count})`}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }, [current, count, index]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title=""
      content={content}
      noAction={false}
      cancelText="ปิด"
      fullScreen={false}
      scrolling={false}
      disableBackdropClose={false}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "black",
          maxWidth: "calc(100vw - 64px)",
          maxHeight: "calc(100vh - 64px)",
          m: 2,
        },
        "& .MuiDialogTitle-root": { display: "none" },
        "& .MuiDialogContent-root": {
          p: 0,
          backgroundColor: "black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
        "& .MuiDialogActions-root": {
          backgroundColor: "black",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        },
        "& .MuiButton-root": { color: "white" },
        ...(sx || {}),
      }}
    />
  );
};

export default BaseLightBox;