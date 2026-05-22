"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";

const MOCK_USERS = [
  { username: "artist_one",  displayName: "Artist One" },
  { username: "artist_two",  displayName: "Artist Two" },
  { username: "collector_3", displayName: "Collector Three" },
];

const UserListTab = () => {
  const theme = useTheme();
  const router = useRouter();
  return (
    <Grid container spacing={2}>
      {MOCK_USERS.map((u) => (
        <Grid key={u.username} size={{ xs: 12, sm: 6, md: 4 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            onClick={() => router.push(`/profile/${u.username}`)}
            sx={{
              p: 2,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              cursor: "pointer",
              transition: "background 0.15s",
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) },
            }}
          >
            <Avatar sx={{ width: 44, height: 44 }}>{u.displayName[0]}</Avatar>
            <Box>
              <Typography fontWeight={600} variant="body2">{u.displayName}</Typography>
              <Typography variant="caption" color="text.secondary">@{u.username}</Typography>
            </Box>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserListTab;
