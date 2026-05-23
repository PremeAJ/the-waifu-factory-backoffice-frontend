"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { BaseLightBox } from "@/common/components/base";
import type { LightboxItem } from "@/common/components/base/BaseLightBox";
import { IconEye, IconHeart, IconPhoto } from "@tabler/icons-react";
import { useNsfw } from "@/common/contexts/NsfwContext";

interface GalleryItem {
  id: string;
  type: "adoptable" | "commission";
  imageUrl: string;
  thumbnailUrl: string | null;
  isNSFW: boolean;
  viewCount: number;
  likeCount: number;
}

const GalleryTab = ({ username }: { username: string }) => {
  const { showNsfw } = useNsfw();

  const { data, isLoading } = useSWR(`/api/user/${username}/gallery`, getFetcher, {
    revalidateOnFocus: false,
  });

  const items: GalleryItem[] = data?.data ?? [];
  const lightboxItems: LightboxItem[] = items.map((item, i) => ({
    src: item.imageUrl,
    alt: `Gallery ${i + 1}`,
  }));

  const [lbOpen, setLbOpen] = useState(false);
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

  if (items.length === 0) {
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
        {items.map((item, i) => {
          const blurred = item.isNSFW && !showNsfw;
          const src = item.thumbnailUrl ?? item.imageUrl;
          return (
            <Grid key={item.id} size={{ xs: 6, sm: 3, md: 2 }}>
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
                    filter: blurred ? "blur(14px)" : undefined,
                    transform: blurred ? "scale(1.06)" : undefined,
                  }}
                />

                {blurred && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: alpha("#000", 0.3),
                      zIndex: 2,
                    }}
                  >
                    <Typography variant="caption" fontWeight={700} sx={{ color: "#fff", bgcolor: alpha("#000", 0.5), px: 1, py: 0.4, borderRadius: 1.5 }}>
                      🔞 NSFW
                    </Typography>
                  </Box>
                )}

                <Box
                  className="overlay"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: alpha("#000", 0.45),
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                    display: "flex",
                    alignItems: "flex-end",
                    p: 1,
                    zIndex: 3,
                  }}
                >
                  <Stack direction="row" spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={0.4}>
                      <IconEye size={12} color="#fff" />
                      <Typography variant="caption" sx={{ color: "#fff", lineHeight: 1, fontSize: 11 }}>
                        {item.viewCount}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.4}>
                      <IconHeart size={12} color="#fff" />
                      <Typography variant="caption" sx={{ color: "#fff", lineHeight: 1, fontSize: 11 }}>
                        {item.likeCount}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Box>
            </Grid>
          );
        })}
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
