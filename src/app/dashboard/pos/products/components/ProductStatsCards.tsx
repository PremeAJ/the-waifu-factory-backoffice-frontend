"use client";
import React, { useMemo } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { IconBox, IconCircleCheck, IconCircleX, IconAlertTriangle } from "@tabler/icons-react";
import { useProducts } from "@/common/contexts/ProductsContext";

const StatCard: React.FC<{ bg: string; icon: React.ReactNode; title: string; value: number | string; iconBg?: string; onClick?: () => void }> = ({
  bg,
  icon,
  title,
  value,
  iconBg,
  onClick,
}) => (
  <Box
    bgcolor={bg}
    p={2}
    borderRadius={2}
    onClick={onClick}
    sx={{
      cursor: onClick ? "pointer" : "default",
      transition: "transform .12s",
      "&:hover": onClick ? { transform: "translateY(-3px)" } : undefined,
    }}
  >
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        width={38}
        height={38}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor={iconBg ?? "rgba(255,255,255,0.08)"}
        borderRadius={1}
      >
        <Typography color="primary.contrastText" display="flex" alignItems="center" justifyContent="center">
          {icon}
        </Typography>
      </Box>

      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6" fontWeight={700}>
          {value}
        </Typography>
      </Box>
    </Stack>
  </Box>
);

const ProductStatsCards: React.FC<{ onFilter?: (filters: any) => void }> = ({ onFilter }) => {
  const { counts } = useProducts();

  const total = counts?.total ?? 0;
  const active = counts?.active ?? 0;
  const inactive = counts?.inactive ?? 0;
  const lowStock = counts?.lowStock ?? 0;

  return (
    <Grid container spacing={2} mb={2} mx={0}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard bg="primary.light" iconBg="primary.main" icon={<IconBox size={20} />} title="สินค้าทั้งหมด" value={total} onClick={() => onFilter?.({})} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard bg="success.light" iconBg="success.main" icon={<IconCircleCheck size={20} />} title="เปิดใช้งาน" value={active} onClick={() => onFilter?.({ status: "active" })} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard bg="error.light" iconBg="error.main" icon={<IconCircleX size={20} />} title="ปิดใช้งาน" value={inactive} onClick={() => onFilter?.({ status: "inactive" })} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard bg="warning.light" iconBg="warning.main" icon={<IconAlertTriangle size={20} />} title="สินค้าเหลือน้อย" value={lowStock} onClick={() => onFilter?.({ isLowStock: true })} />
      </Grid>
    </Grid>
  );
};

export default ProductStatsCards;