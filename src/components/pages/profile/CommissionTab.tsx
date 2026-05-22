"use client";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { IconBrush } from "@tabler/icons-react";

const CommissionTab = () => (
  <Box sx={{ textAlign: "center", py: 12, color: "text.secondary" }}>
    <Box sx={{ opacity: 0.35 }}><IconBrush size={56} stroke={1.2} /></Box>
    <Typography variant="h6" mt={1.5} fontWeight={600}>No commissions available</Typography>
  </Box>
);

export default CommissionTab;
