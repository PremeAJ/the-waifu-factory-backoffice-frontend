"use client";
import React, { useContext, useState } from "react";
import { Grid, Card, CardContent, Typography, TextField, InputAdornment, useTheme, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { categories, products } from "@/common/constants/products/dataMock";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import Badge from "@mui/material/Badge";
import BaseSearchField from "@/common/components/base/BaseSearchField";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import OrderSummary from "./OrderSummary";
import ProductList from "./ProductList";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Sidebar from "./category/Sidebar";
import StorefrontIcon from "@mui/icons-material/Storefront";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import CategoryButton from "@/common/components/floating/CategoryButton";
import PageContainer from "@/components/container/PageContainer";

export default function POSPage() {
  const [openCategory, setOpenCategory] = useState<{ [key: number]: boolean }>({});
  const [order, setOrder] = useState<{ id: number; name: string; price: number; qty: number; image: string }[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const theme = useTheme();
  const handleToggleCategory = (catId: number) => {
    setOpenCategory((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 0) {
      return p.name.toLowerCase().includes(search.toLowerCase());
    }
    if (selectedSubCategory) {
      return p.categoryId === selectedSubCategory && p.name.toLowerCase().includes(search.toLowerCase());
    }
    const cat = categories.find((c) => c.id === selectedCategory);
    const subIds = cat?.children?.map((c) => c.id) || [];
    return (p.categoryId === selectedCategory || subIds.includes(p.categoryId)) && p.name.toLowerCase().includes(search.toLowerCase());
  });

  const addToOrder = (product: (typeof products)[0]) => {
    const inOrder = order.find((item) => item.id === product.id)?.qty || 0;
    if (product.stock !== undefined && inOrder >= product.stock) return;

    setOrder((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromOrder = (productId: number) => {
    setOrder((prev) => prev.map((item) => (item.id === productId ? { ...item, qty: item.qty - 1 } : item)).filter((item) => item.qty > 0));
  };
  const total = order.reduce((sum, item) => sum + item.price * item.qty, 0);
  const { setIsMobileSidebar } = useContext(CustomizerContext);

  return (
    <PageContainer title="Cashier" description="this is Cashier">
      <CategoryButton onClick={() => setIsMobileSidebar(true)} />
      <Sidebar />
      <Grid
        container
        spacing={2}
        sx={{
          height: isMobile ? "auto" : "100vh",
          pb: isMobile ? 7 : 0,
          ml: isMobile ? 0 : "269px",
        }}
      >
        <Grid
          id="product"
          size={isMobile ? 12 : 9}
          sx={{
            mt:5,
            order: isMobile ? 2 : 0,
            transition: (theme) => theme.transitions.create("margin-left"),
          }}
        >
          <Card sx={{ display: "flex", flexDirection: "column", height: isMobile ? "auto" : "100%" }}>
            <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <BaseSearchField value={search} onSearchChange={setSearch} sx={{ mb: 2 }} />
              <ProductList filteredProducts={filteredProducts} order={order} addToOrder={addToOrder} isMobile={isMobile} />
            </CardContent>
          </Card>
        </Grid>
        <Grid
          id="order"
          size={isMobile ? 12 : 3}
          sx={{
            height: isMobile ? "auto" : "100%",
            order: isMobile ? 3 : 0,
            mt: isMobile ? 2 : 0,
          }}
        >
          <OrderSummary
            order={order}
            addToOrder={addToOrder}
            removeFromOrder={removeFromOrder}
            setOrder={setOrder}
            total={total}
            isMobile={isMobile}
          />
        </Grid>
      </Grid>
      {isMobile && (
        <BottomNavigation
          showLabels
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 99,
            borderTop: "1px solid primary.main",
            justifyContent: "space-around",
          }}
        >
          <BottomNavigationAction
            label="สินค้า"
            icon={<StorefrontIcon />}
            onClick={() => {
              document.getElementById("product")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
          <BottomNavigationAction
            label="ออเดอร์"
            icon={
              <Badge color="error" badgeContent={order.reduce((sum, item) => sum + item.qty, 0)}>
                <ShoppingCartIcon />
              </Badge>
            }
            onClick={() => {
              document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </BottomNavigation>
      )}
    </PageContainer>
  );
}
