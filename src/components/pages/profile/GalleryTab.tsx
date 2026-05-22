"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { BaseLightBox } from "@/common/components/base";
import type { LightboxItem } from "@/common/components/base/BaseLightBox";
import { IconPhoto } from "@tabler/icons-react";

const GalleryTab = ({ username }: { username: string }) => {
  const { data, isLoading } = useSWR(`/api/user/${username}/gallery`, getFetcher, {
    revalidateOnFocus: false,
  });

  const images: string[] = data?.data ?? [];
  const lightboxItems: LightboxItem[] = images.map((src, i) => ({ src, alt: `Gallery ${i + 1}` }));

  const [lbOpen, setLbOpen]   = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLbIndex(index);
    setLbOpen(true);
  };

  if (isLoading) {
    return (
      <Grid container spacing={1.5}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Grid key={i} size={{ xs: 6, sm: 3, md: 2 }}>
            <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: "100%", borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (images.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 12, color: "text.secondary" }}>
        <Box sx={{ opacity: 0.35 }}><IconPhoto size={56} stroke={1.2} /></Box>
        <Typography variant="h6" mt={1.5} fontWeight={600}>No artworks yet</Typography>
        <Typography variant="body2" mt={0.5}>Gallery coming soon</Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={1.5}>
        {images.map((src, i) => (
          <Grid key={i} size={{ xs: 6, sm: 3, md: 2 }}>
            <Box
              onClick={() => openLightbox(i)}
              sx={{
                position: "relative",
                width: "100%",
                paddingTop: "100%",
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                "&:hover img": { transform: "scale(1.07)" },
                "&:hover .overlay": { opacity: 1 },
              }}
            >
              <Box
                component="img"
                src={src}
                alt={`Gallery ${i + 1}`}
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.25s ease",
                }}
              />
              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0,0,0,0.28)",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconPhoto size={28} color="#fff" />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <BaseLightBox
        open={lbOpen}
        onClose={() => setLbOpen(false)}
        items={lightboxItems}
        currentIndex={lbIndex}
        onChangeIndex={setLbIndex}
      />
    </>
  );
};

export default GalleryTab;
