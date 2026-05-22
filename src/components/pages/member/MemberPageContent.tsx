"use client";
import React, { useCallback, useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { useRouter } from "next/navigation";
import { getFetcher } from "@/app/api/globalFetcher";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { IconSearch, IconUsers } from "@tabler/icons-react";
import { useInfiniteScroll } from "@/common/components/base/BaseTable/hooks";

const PAGE_SIZE = 20;

interface MasterUser {
  id: string;
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
}

const MemberCard = ({ user }: { user: MasterUser }) => {
  const theme  = useTheme();
  const router = useRouter();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      onClick={() => router.push(`/profile/${user.username}`)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.75,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        cursor: "pointer",
        transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
        bgcolor: "background.paper",
        "&:hover": {
          borderColor: "primary.main",
          bgcolor: isDark ? alpha(theme.palette.primary.main, 0.06) : alpha(theme.palette.primary.main, 0.04),
          boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.12)}`,
        },
      }}
    >
      <Avatar src={user.profilePictureUrl ?? undefined} sx={{ width: 46, height: 46, fontSize: 18, flexShrink: 0 }}>
        {user.displayName[0]}
      </Avatar>
      <Box minWidth={0}>
        <Typography variant="body2" fontWeight={700} noWrap>{user.displayName}</Typography>
        <Typography variant="caption" color="text.secondary" noWrap>@{user.username}</Typography>
      </Box>
    </Box>
  );
};

const MemberPageContent = () => {
  const [inputValue, setInputValue] = useState("");
  const [search,     setSearch]     = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearch(inputValue), 350);
    return () => clearTimeout(t);
  }, [inputValue]);

  const getKey = (pageIndex: number, prev: any) => {
    if (pageIndex > 0 && !prev) return null;
    if (prev && !prev.meta?.hasMore) return null;
    const params: Record<string, any> = { limit: PAGE_SIZE };
    if (search) params.search = search;
    if (pageIndex > 0 && prev?.meta?.nextCursor) params.cursor = prev.meta.nextCursor;
    return ["/api/master/user-list", params];
  };

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, getFetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const pages      = data ?? [];
  const isLoading  = !data && isValidating;
  const items: MasterUser[] = pages.flatMap((p) => p?.data ?? []);
  const hasMore    = pages[pages.length - 1]?.meta?.hasMore ?? false;
  // const totalCount = pages[0]?.meta?.total ?? null;

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isValidating) setSize((s) => s + 1);
  }, [hasMore, isValidating, setSize]);

  const { ref: loadMoreRef } = useInfiniteScroll(handleLoadMore);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800} mb={0.5}>Members</Typography>
        {/* <Typography variant="body2" color="text.secondary">
          {isLoading
            ? "Loading..."
            : totalCount != null
            ? `${totalCount} member${totalCount !== 1 ? "s" : ""}`
            : `${items.length} member${items.length !== 1 ? "s" : ""}`}
        </Typography> */}
      </Box>

      <TextField
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search by name or username..."
        fullWidth
        size="small"
        sx={{ mb: 4, maxWidth: 420 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size={18} style={{ opacity: 0.45 }} />
              </InputAdornment>
            ),
          },
        }}
      />

      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Skeleton variant="rectangular" height={72} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : items.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 12, color: "text.secondary" }}>
          <Box sx={{ opacity: 0.3 }}><IconUsers size={56} stroke={1.2} /></Box>
          <Typography variant="h6" mt={1.5} fontWeight={600}>
            {search ? "No members found" : "No members yet"}
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {items.map((user) => (
              <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <MemberCard user={user} />
              </Grid>
            ))}
          </Grid>

          {hasMore && <Box ref={loadMoreRef} sx={{ height: 1, width: "100%" }} />}

          {hasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                variant="contained"
                onClick={() => setSize(size + 1)}
                disabled={isValidating}
                sx={{ textTransform: "none", borderRadius: 3, px: 4 }}
              >
                {isValidating ? <CircularProgress size={20} color="inherit" /> : "Load more"}
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default MemberPageContent;
