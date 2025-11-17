"use client";
import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { IconArrowLeft, IconArrowRight, IconMaximize, IconZoomIn, IconZoomOut } from "@tabler/icons-react";
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
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState(0); // ✅ pinch distance

  const hasExternalIndex = typeof currentIndex === "number";
  const index = hasExternalIndex ? (currentIndex as number) : internalIndex;

  useEffect(() => {
    if (!hasExternalIndex && open) setInternalIndex(0);
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, [open, hasExternalIndex, index]);

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

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 1));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  // ✅ Helper: calculate distance between two touch points
  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // ✅ Helper: calculate center point between two touch points
  const getTouchCenter = (touches: TouchList) => {
    if (touches.length < 2) return { x: 0, y: 0 };
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  // ✅ Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setTouchDistance(getTouchDistance(e.touches));
    } else if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panX,
        y: e.touches[0].clientY - panY,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const newDistance = getTouchDistance(e.touches);
      const scale = newDistance / touchDistance;
      const newZoom = Math.max(1, Math.min(zoom * scale, 3));
      setZoom(newZoom);
      setTouchDistance(newDistance);
    } else if (e.touches.length === 1 && isDragging && zoom > 1) {
      setPanX(e.touches[0].clientX - dragStart.x);
      setPanY(e.touches[0].clientY - dragStart.y);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchDistance(0);
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(1, Math.min(prev + delta, 3)));
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") onClose();
      else if (e.key === "+") handleZoomIn();
      else if (e.key === "-") handleZoomOut();
      else if (e.key === "0") handleResetZoom();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, count, zoom]);

  const current = items[index];

  const content = useMemo(() => {
    if (!current) return null;

    const captionRaw = current.caption ?? "";
    const captionWithoutCounter = captionRaw.replace(/\s*\(\d+\/\d+\)\s*$/, "");
    const shouldShowCounter = showCounter && count > 1 && !/\(\d+\/\d+\)\s*$/.test(captionRaw);

    return (
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          overflow: "hidden",
          cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          touchAction: zoom > 1 ? "none" : "auto", // ✅ ป้องกัน default pinch
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {canNavigate && (
          <IconButton
            onClick={goPrev}
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
              backgroundColor: "rgba(0,0,0,0.35)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
              zIndex: 2,
            }}
            aria-label="previous"
          >
            <IconArrowLeft />
          </IconButton>
        )}

        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "flex",
            gap: 1,
            zIndex: 2,
          }}
        >
          <IconButton
            onClick={handleZoomIn}
            sx={{
              color: "white",
              backgroundColor: "rgba(0,0,0,0.35)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
            }}
            size="small"
          >
            <IconZoomIn size={18} />
          </IconButton>
          <IconButton
            onClick={handleZoomOut}
            sx={{
              color: "white",
              backgroundColor: "rgba(0,0,0,0.35)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
            }}
            size="small"
            disabled={zoom <= 1}
          >
            <IconZoomOut size={18} />
          </IconButton>
          <IconButton
            onClick={handleResetZoom}
            sx={{
              color: "white",
              backgroundColor: "rgba(0,0,0,0.35)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
            }}
            size="small"
            disabled={zoom === 1}
          >
            <IconMaximize size={18} />
          </IconButton>
        </Box>

        <Box
          component="img"
          src={current.src}
          alt={current.alt || "image"}
          sx={{
            maxWidth: "100%",
            maxHeight: "calc(100vh - 128px)",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            display: "block",
            zIndex: 1,
            transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
            userSelect: "none",
            pointerEvents: "auto",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
          }}
        />

        {canNavigate && (
          <IconButton
            onClick={goNext}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
              backgroundColor: "rgba(0,0,0,0.35)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
              zIndex: 2,
            }}
            aria-label="next"
          >
            <IconArrowRight />
          </IconButton>
        )}

        {(captionWithoutCounter || shouldShowCounter) && (
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
              {captionWithoutCounter}
              {shouldShowCounter && ` (${index + 1}/${count})`}
              {zoom > 1 && ` - Zoom: ${Math.round(zoom * 100)}%`}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }, [current, count, index, showCounter, canNavigate, zoom, panX, panY, isDragging]);

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title=""
      content={content}
      noAction
      fullScreen={false}
      scrolling={false}
      disableBackdropClose={false}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "black",
          maxWidth: "calc(100vw - 64px)",
          maxHeight: "100vh",
          m: 2,
          overflow: "hidden",
        },
        "& .MuiDialogTitle-root": { display: "none" },
        "& .MuiDialogContent-root": {
          p: 0,
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: "calc(100vh - 64px)",
          overflow: "hidden",
        },
        "& .MuiDialogActions-root": {
          backgroundColor: "black",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        },
        "& .MuiButton-root": { color: "white" },
        "& img": { userSelect: "none", pointerEvents: "auto" },
        ...(sx || {}),
      }}
    />
  );
};

export default BaseLightBox;