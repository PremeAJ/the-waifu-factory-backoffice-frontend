"use client";
import React from "react";
import { IconBox, IconCircleCheck, IconCircleX, IconAlertTriangle } from "@tabler/icons-react";
import { useProducts } from "@/common/contexts/ProductsContext";
import { useSearchParams } from "next/navigation";
import BaseStatCards, { StatItem } from "@/common/components/base/BaseStatCards";

const ProductStatsCards: React.FC<{ onFilter?: (filters: any) => void }> = ({ onFilter }) => {
  const { counts, loading } = useProducts(); // <-- use loading
  const searchParams = useSearchParams();

  const total = counts?.total ?? 0;
  const active = counts?.active ?? 0;
  const inactive = counts?.inactive ?? 0;
  const lowStock = counts?.lowStock ?? 0;

  const status = searchParams?.get("status") ?? undefined;
  const isLowStock = (searchParams?.get("isLowStock") ?? "").toString().toLowerCase() === "true";

  const hasAnyFilter = ["status", "categoryId", "minPrice", "maxPrice", "stockMin", "stockMax", "isLowStock", "search"].some(
    (k) => !!searchParams?.get(k)
  );

  const items: StatItem[] = [
    {
      id: "all",
      title: "สินค้าทั้งหมด",
      value: total,
      icon: <IconBox size={20} />,
      bg: "primary.light",
      iconBg: "primary.main",
      selected: !hasAnyFilter,
      onClick: () => onFilter?.({}),
    },
    {
      id: "active",
      title: "เปิดใช้งาน",
      value: active,
      icon: <IconCircleCheck size={20} />,
      bg: "success.light",
      iconBg: "success.main",
      selected: status === "active",
      onClick: () => onFilter?.({ status: "active" }),
    },
    {
      id: "inactive",
      title: "ปิดใช้งาน",
      value: inactive,
      icon: <IconCircleX size={20} />,
      bg: "error.light",
      iconBg: "error.main",
      selected: status === "inactive",
      onClick: () => onFilter?.({ status: "inactive" }),
    },
    {
      id: "lowStock",
      title: "สินค้าเหลือน้อย",
      value: lowStock,
      icon: <IconAlertTriangle size={20} />,
      bg: "warning.light",
      iconBg: "warning.main",
      selected: isLowStock,
      onClick: () => onFilter?.({ isLowStock: true }),
    },
  ];

  // pass loading to BaseStatCards so numbers show skeleton while loading
  return <BaseStatCards items={items} loading={loading} />;
};

export default ProductStatsCards;