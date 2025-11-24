"use client";
import React from "react";
import { Box, Grid, Stack, Typography, Skeleton } from "@mui/material";

export type StatItem = {
  id?: string | number;
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  bg?: string; // background (theme key or color)
  iconBg?: string; // icon bg or color key
  selected?: boolean;
  onClick?: (item: StatItem) => void;
  loading?: boolean;
};

type Props = {
  items: StatItem[];
  size?: { xs?: number; sm?: number; md?: number; lg?: number };
  containerProps?: any;
  itemProps?: any;
  loading?: boolean; // global loading flag
};

const BaseStatCards: React.FC<Props> = ({ items, size = { xs: 12, sm: 6, md: 3 }, containerProps, itemProps, loading = false }) => {
  return (
    <Grid container spacing={2} mb={2} {...containerProps}>
      {items.map((item, idx) => {
        const key = item.id ?? idx;
        const selectedColor = item.iconBg ?? "primary.main";
        return (
          <Grid key={key} size={{ xs: size.xs, sm: size.sm, md: size.md, lg: size.lg }} {...itemProps}>
            <Box
              bgcolor={item.bg ?? "transparent"}
              p={2}
              borderRadius={2}
              onClick={() => item.onClick?.(item)}
              sx={{
                cursor: item.onClick ? "pointer" : "default",
                transition: "transform .12s, border-color .12s",
                "&:hover": item.onClick ? { transform: "translateY(-3px)" } : undefined,
                border: item.selected ? "2px solid" : "2px solid transparent",
                borderColor: item.selected ? selectedColor : "transparent",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  width={38}
                  height={38}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor={item.iconBg ?? "rgba(255,255,255,0.08)"}
                  borderRadius={1}
                >
                  <Typography color="primary.contrastText" display="flex" alignItems="center" justifyContent="center">
                    {item.icon}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.title}
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {(loading || item.loading) ? <Skeleton variant="rectangular" width={25} height={20} /> : item.value}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default BaseStatCards;