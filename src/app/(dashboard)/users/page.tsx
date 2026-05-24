"use client";
import { getFetcher, patchFetcher } from "@/app/api/globalFetcher";
import PageContainer from "@/components/container/PageContainer";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { IconSearch, IconUsers } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
  createdAt: string;
  bannedAt: string | null;
}

const UserCard = ({
  user,
  onBanToggle,
  actionLoading,
}: {
  user: AdminUser;
  onBanToggle: (id: string, isBanned: boolean) => void;
  actionLoading: boolean;
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isBanned = !!user.bannedAt;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        p: 1.75,
        borderRadius: 3,
        border: `1px solid ${isBanned ? theme.palette.error.light : theme.palette.divider}`,
        bgcolor: isBanned
          ? alpha(theme.palette.error.main, isDark ? 0.08 : 0.04)
          : "background.paper",
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": {
          borderColor: isBanned ? "error.main" : "primary.main",
          boxShadow: `0 4px 16px ${alpha(isBanned ? theme.palette.error.main : theme.palette.primary.main, 0.12)}`,
        },
      }}
    >
      {/* Top row: avatar + name + status */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
        onClick={() => window.open(`${process.env.NEXT_PUBLIC_CLIENT_URL}/profile/${user.username}`, "_blank")}
      >
        <Avatar src={user.profilePictureUrl ?? undefined} sx={{ width: 46, height: 46, fontSize: 18, flexShrink: 0 }}>
          {user.displayName[0]}
        </Avatar>
        <Box minWidth={0} flex={1}>
          <Typography variant="body2" fontWeight={700} noWrap>{user.displayName}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>@{user.username}</Typography>
        </Box>
        <Chip
          label={isBanned ? "Banned" : "Active"}
          color={isBanned ? "error" : "success"}
          size="small"
          sx={{ flexShrink: 0 }}
        />
      </Box>

      {/* Action */}
      <Button
        size="small"
        fullWidth
        variant="outlined"
        color={isBanned ? "success" : "error"}
        disabled={actionLoading}
        onClick={() => onBanToggle(user.id, isBanned)}
        sx={{ borderRadius: 2, textTransform: "none" }}
      >
        {isBanned ? "Unban" : "Ban"}
      </Button>
    </Box>
  );
};

export default function UsersPage() {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSearch(inputValue), 350);
    return () => clearTimeout(t);
  }, [inputValue]);

  const params: Record<string, any> = { limit: 50 };
  if (search) params.search = search;

  const { data, isLoading, error, mutate } = useSWR(
    ["/api/admin/user", params],
    getFetcher,
    { revalidateOnFocus: false }
  );

  const users: AdminUser[] = data?.data ?? [];

  const handleBanToggle = async (id: string, isBanned: boolean) => {
    setLoading(true);
    const endpoint = isBanned ? `/api/admin/user/${id}/unban` : `/api/admin/user/${id}/ban`;
    await patchFetcher(endpoint, {});
    await mutate();
    setLoading(false);
  };

  return (
    <PageContainer title="Users" description="Manage all users">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Manage Users</Typography>
        <TextField
          size="small"
          placeholder="Search by name or username..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={18} style={{ opacity: 0.45 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: 280 }}
        />
      </Stack>

      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Skeleton variant="rectangular" height={110} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Typography color="error">Failed to load data</Typography>
      ) : users.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 12, color: "text.secondary" }}>
          <Box sx={{ opacity: 0.3 }}><IconUsers size={56} stroke={1.2} /></Box>
          <Typography variant="h6" mt={1.5} fontWeight={600}>
            {search ? "No users found" : "No users yet"}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <UserCard user={user} onBanToggle={handleBanToggle} actionLoading={loading} />
            </Grid>
          ))}
        </Grid>
      )}
    </PageContainer>
  );
}
