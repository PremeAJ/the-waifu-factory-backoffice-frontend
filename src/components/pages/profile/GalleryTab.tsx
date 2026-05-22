"use client";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { IconPhoto } from "@tabler/icons-react";

const GalleryTab = () => (
  <Box sx={{ textAlign: "center", py: 12, color: "text.secondary" }}>
    <Box sx={{ opacity: 0.35 }}><IconPhoto size={56} stroke={1.2} /></Box>
    <Typography variant="h6" mt={1.5} fontWeight={600}>No artworks yet</Typography>
    <Typography variant="body2" mt={0.5}>Gallery coming soon</Typography>
  </Box>
);

export default GalleryTab;
