"use client";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { deleteFetcher, getFetcher, postFetcher } from "@/app/api/globalFetcher";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { IconExternalLink, IconEye, IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { BaseChip } from "@/common/components/base";
import ArtistLink from "@/common/components/shared/ArtistLink";
import { useNsfw } from "@/common/contexts/NsfwContext";
import type { CommissionPost } from "./types";

const CommissionDetailPageContent = ({ id }: { id: string }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const tagTextColor = isDark ? "#fff" : "#555";
  const { showNsfw } = useNsfw();

  const { data, isLoading } = useSWR(`/api/commission/${id}`, getFetcher, { revalidateOnFocus: false });
  const item: CommissionPost | undefined = data?.data;
  const blurred = item ? item.isNSFW && !showNsfw : false;

  const [liked,      setLiked]      = useState(false);
  const [likeCount,  setLikeCount]  = useState(0);
  const [liking,     setLiking]     = useState(false);

  useEffect(() => {
    if (item) {
      setLiked(item.isLiked ?? false);
      setLikeCount(item.likeCount ?? 0);
    }
  }, [item?.id]);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    try {
      if (next) await postFetcher(`/api/commission/${id}/like`, {});
      else      await deleteFetcher(`/api/commission/${id}/like`, {});
    } catch {
      setLiked(!next);
      setLikeCount((c) => c + (next ? -1 : 1));
    } finally {
      setLiking(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Skeleton variant="rectangular" sx={{ borderRadius: 4, aspectRatio: "1/1", width: "100%" }} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Skeleton variant="rectangular" height={480} sx={{ borderRadius: 4 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">Commission not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={4} alignItems="flex-start">

        {/* Image */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ position: "relative", borderRadius: 4, overflow: "hidden", boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.55)" : "0 24px 64px rgba(0,0,0,0.13)" }}>
            <Box
              component="img"
              src={item.imageUrl}
              alt={item.title}
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
                filter: blurred ? "blur(20px)" : undefined,
                transform: blurred ? "scale(1.05)" : undefined,
              }}
            />
            {blurred && (
              <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: alpha("#000", 0.35), zIndex: 2 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: "#fff", bgcolor: alpha("#000", 0.55), px: 2.5, py: 1, borderRadius: 2 }}>
                  🔞 NSFW
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Info card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ position: { md: "sticky" }, top: { md: 24 } }}>
            <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}`, overflow: "hidden" }}>

              {/* Status bar */}
              <Box sx={{ px: 3, py: 1.75, bgcolor: alpha(theme.palette.primary.main, 0.06), display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="body2" fontWeight={700} color="primary.main">Commission Post</Typography>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconEye size={15} style={{ opacity: 0.5 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      {(item.viewCount ?? 0).toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.25}>
                    <Typography variant="body2" color={liked ? "error.main" : "text.secondary"} fontWeight={600}>
                      {likeCount.toLocaleString()}
                    </Typography>
                    <IconButton size="small" onClick={handleLike}
                      sx={{ p: 0.5, color: liked ? "error.main" : "text.secondary", "&:hover": { color: "error.main" } }}>
                      {liked ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>

              <Box sx={{ p: 3 }}>
                {/* Title + price */}
                {item.price != null ? (
                  <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                    <Typography variant="h5" fontWeight={800}>{item.title}</Typography>
                    <Typography variant="h4" fontWeight={800} color="primary.main">${item.price.toLocaleString()}</Typography>
                  </Stack>
                ) : (
                  <Typography variant="h5" fontWeight={800}>{item.title}</Typography>
                )}

                {item.description && (
                  <Typography variant="body2" color="text.secondary" mt={1.5} sx={{ lineHeight: 1.7 }}>
                    {item.description}
                  </Typography>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Artist */}
                <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5}>Artist</Typography>
                <ArtistLink
                  username={item.artist.username}
                  displayName={item.artist.displayName}
                  profilePictureUrl={item.artist.profilePictureUrl}
                  avatarSize={44}
                  showUsername
                  sx={{ mt: 1.25 }}
                  endSlot={
                    item.artist.paymentMethods && item.artist.paymentMethods.length > 0 ? (
                      <Stack direction="row" spacing={0.75} flexShrink={0}>
                        {item.artist.paymentMethods.slice(0, 4).map((pm, i) => (
                          <Box key={i} component="img" src={pm.iconUrl} alt={pm.name} title={`${pm.name}: ${pm.accountValue}`} sx={{ height: 20, width: "auto", objectFit: "contain" }} />
                        ))}
                      </Stack>
                    ) : undefined
                  }
                />

                {/* Owner */}
                {item.owner && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5}>Owner</Typography>
                    <ArtistLink
                      username={item.owner.username}
                      displayName={item.owner.displayName}
                      profilePictureUrl={item.owner.profilePictureUrl}
                      avatarSize={44}
                      showUsername
                      sx={{ mt: 1.25 }}
                    />
                  </>
                )}

                {/* Tags */}
                {(item.tags ?? []).length > 0 && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5} display="block" mb={1.25}>Tags</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                      {(item.tags ?? []).map((tag, i) => (
                        <BaseChip key={i} label={tag.name} customBgColor={tag.color + "33"} customColor={tagTextColor} size="small" />
                      ))}
                    </Box>
                  </>
                )}

                {/* View post CTA */}
                {item.postUrl && (
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    href={item.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    endIcon={<IconExternalLink size={18} />}
                    sx={{ mt: 3.5, textTransform: "none", borderRadius: 2, py: 1.5, fontWeight: 700, fontSize: 15 }}
                  >
                    View Original Post
                  </Button>
                )}
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CommissionDetailPageContent;
