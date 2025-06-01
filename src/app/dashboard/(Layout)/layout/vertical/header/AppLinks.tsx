import { Avatar, Box, Typography, Paper } from "@mui/material";
import * as dropdownData from "./data";
import Link from "next/link";
import React from "react";
import Grid from "@mui/system/Grid";

interface AppLinksProps {
  searchApp?: string;
}

const AppLinks: React.FC<AppLinksProps> = ({ searchApp = "" }) => {
  const filteredApps = dropdownData.appsLink.filter(
    (app) =>
      app.title.toLowerCase().includes(searchApp.toLowerCase()) ||
      app.subtext?.toLowerCase().includes(searchApp.toLowerCase())
  );

  return (
    <Grid container spacing={2}>
      {filteredApps.map((app, index) => (
        <Grid size={{ xs: 3 }} key={index}>
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
                  border: `2px solid ${app.color || "#1976d2"}`,
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: "0 8px 24px 0 rgba(0,0,0,0.18)",
                    borderColor: "#1565c0",
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
        </Grid>
      ))}
    </Grid>
  );
};

export default AppLinks;
