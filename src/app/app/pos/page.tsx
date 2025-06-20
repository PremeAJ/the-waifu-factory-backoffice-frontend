"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close"; // เพิ่ม import
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Image from "next/image";
import BlockIcon from "@mui/icons-material/Block"; // เพิ่ม icon สำหรับสินค้าหมด
import { categories, products } from "./dataMock";
import SidebarCategory from "./SidebarCategory";
import ProductList from "./ProductList";
import OrderSummary from "./OrderSummary";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Badge from "@mui/material/Badge";

export default function POSPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
  const [openCategory, setOpenCategory] = useState<{ [key: number]: boolean }>({});
  const [order, setOrder] = useState<{ id: number; name: string; price: number; qty: number; image: string }[]>([]);
  const [mobileTab, setMobileTab] = useState(0); // 0 = product, 1 = order
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Handle expand/collapse
  const handleToggleCategory = (catId: number) => {
    setOpenCategory((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 0) {
      return p.name.toLowerCase().includes(search.toLowerCase());
    }
    if (selectedSubCategory) {
      return p.categoryId === selectedSubCategory && p.name.toLowerCase().includes(search.toLowerCase());
    }
    // ถ้าเลือก category หลัก ให้แสดงสินค้าทั้งหมดใน category นั้นและ subcategory
    const cat = categories.find((c) => c.id === selectedCategory);
    const subIds = cat?.children?.map((c) => c.id) || [];
    return (p.categoryId === selectedCategory || subIds.includes(p.categoryId)) && p.name.toLowerCase().includes(search.toLowerCase());
  });

  // ปรับ addToOrder ให้เช็ค stock
  const addToOrder = (product: typeof products[0]) => {
    // นับจำนวนที่เลือกใน order
    const inOrder = order.find((item) => item.id === product.id)?.qty || 0;
    if (product.stock !== undefined && inOrder >= product.stock) return; // ถ้าของหมดหรือเกิน stock ห้ามเพิ่ม

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

  return (
    <>
      {/* เพิ่ม ref หรือ id ให้แต่ละ section */}
      <Grid container spacing={2} sx={{ height: isMobile ? "auto" : "100vh", pb: isMobile ? 7 : 0 }}>
        <Grid
          id="category"
          size={{ xs: 12, sm: 3, md: 2 }}
          sx={{
            height: isMobile ? "auto" : "100%",
            order: isMobile ? 1 : 0,
            mb: isMobile ? 2 : 0,
          }}
        >
          <Paper sx={{ height: "100%", p: 2, bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom>
              หมวดหมู่
            </Typography>
            <SidebarCategory
              categories={categories}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              openCategory={openCategory}
              setSelectedCategory={setSelectedCategory}
              setSelectedSubCategory={setSelectedSubCategory}
              handleToggleCategory={handleToggleCategory}
              isMobile={isMobile}
            />
          </Paper>
        </Grid>
        <Grid
          id="product"
          size={{ xs: 12, sm: 9, md: 7 }}
          sx={{
            order: isMobile ? 2 : 0,
          }}
        >
          <Card sx={{ display: "flex", flexDirection: "column", height: isMobile ? "auto" : "100%" }}>
            <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography variant="h5" gutterBottom>
                สินค้าทั้งหมด
              </Typography>
              <TextField
                placeholder="ค้นหาสินค้า"
                size="small"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <ProductList
                filteredProducts={filteredProducts}
                order={order}
                addToOrder={addToOrder}
                isMobile={isMobile}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid
          id="order"
          size={{ xs: 12, md: 3 }}
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
      {/* Bottom Navigation สำหรับ mobile */}
      {isMobile && (
        <BottomNavigation
          showLabels
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            borderTop: "1px solid #eee",
            bgcolor: "#fff",
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
    </>
  );
}
