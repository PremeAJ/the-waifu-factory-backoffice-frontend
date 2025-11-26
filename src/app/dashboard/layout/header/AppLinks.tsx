import { Avatar, Box, Typography, Paper, Button } from "@mui/material";
import { shortcutList } from "@/common/components/FAB/AppShortcutButton/shortcutList";
import Grid from "@mui/system/Grid";
import Link from "next/link";
import React, { useState } from "react";
import { useSidebarState } from "@/common/contexts";

interface AppLinksProps {
  searchApp?: string;
}

const AppLinks: React.FC<AppLinksProps> = ({ searchApp = "" }) => {
  const { closeAppShortcut, setOpenBarcodeDialog } = useSidebarState();

  const filteredApps = shortcutList.filter(
    (app) => app.title.toLowerCase().includes(searchApp.toLowerCase()) || app.subtext?.toLowerCase().includes(searchApp.toLowerCase())
  );

  return (
    <Grid container spacing={2}>
      {filteredApps.map((app, index) => (
        <Grid size={{ xs: 3 }} key={index} onClick={closeAppShortcut}>
          {app.action === "barcode" ? (
            <Paper
              elevation={0}
              onClick={() => {
                setOpenBarcodeDialog(true);
                closeAppShortcut();
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 1,
                textAlign: "center",
                borderRadius: 2,
                bgcolor: "none",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  bgcolor: "primary.light",
                  "& .app-name": {
                    color: "primary.main",
                  },
                },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: (theme) => theme.palette.action.hover,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 1,
                  boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
                  border: `2px solid ${app.color || "#eb9e37"}`,
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: "0 8px 24px 0 rgba(0,0,0,0.18)",
                    borderColor: "#eb9e37",
                  },
                }}
              >
                <Avatar
                  src={app.avatar}
                  alt={app.title}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                className="app-name"
                noWrap
                sx={{
                  width: "100%",
                  fontWeight: 500,
                  fontSize: "11px",
                  color: "text.primary",
                }}
              >
                {app.title.split(" ")[0]}
              </Typography>
            </Paper>
          ) : (
            <Link
              href={app.href}
              style={{
                textDecoration: "none",
                display: "block",
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 1,
                  textAlign: "center",
                  borderRadius: 2,
                  bgcolor: "none",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    bgcolor: "primary.light",
                    "& .app-name": {
                      color: "primary.main",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: (theme) => theme.palette.action.hover,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 1,
                    boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
                    border: `2px solid ${app.color || "#eb9e37"}`,
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: "0 8px 24px 0 rgba(0,0,0,0.18)",
                      borderColor: "#eb9e37",
                    },
                  }}
                >
                  <Avatar
                    src={app.avatar}
                    alt={app.title}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  className="app-name"
                  noWrap
                  sx={{
                    width: "100%",
                    fontWeight: 500,
                    fontSize: "11px",
                    color: "text.primary",
                  }}
                >
                  {app.title.split(" ")[0]}
                </Typography>
              </Paper>
            </Link>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default AppLinks;
