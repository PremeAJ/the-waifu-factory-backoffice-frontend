"use client";
import React, { useContext, useState, useMemo } from "react";
import { Grid, Card, CardContent, Typography, Badge } from "@mui/material";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { useCategories } from "@/common/contexts/CategoriesContext";
import { useProducts } from "@/common/contexts/ProductsContext";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import OrderSummary from "./OrderSummary";
import ProductList from "./ProductList";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Sidebar from "./category/Sidebar";
import StorefrontIcon from "@mui/icons-material/Storefront";
import useIsMobile from "@/common/utils/state/isMobile";
import CategoryButton from "@/common/components/FAB/CategoryButton";
import PageContainer from "@/components/container/PageContainer";
import BaseSearchField from "@/common/components/base/BaseSearchField";

export default function POSPage() {
  const [order, setOrder] = useState<{ id: string; name: string; price: number; qty: number; image: string; stock?: number }[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { setIsMobileSidebar } = useContext(CustomizerContext);
  
  const { categories } = useCategories();
  const { products } = useProducts();

  // แปลง products เป็น format ที่ใช้งาน
  const mappedProducts = useMemo(() => {
    if (!products) return [];
    
    return products.flatMap((product: any) => {
      // ถ้ามี variant
      if (product.productOptions && product.productOptions.length > 0) {
        return product.productOptions.map((option: any) => {
          // ✅ ดึงรูปจาก option.productFiles แทน product.productFiles
          const thumbnail = option.productFiles?.url || "/images/products/no-image.jpg";
          
          return {
            id: option.id,
            name: `${product.nameTh}${option.variantOption ? ` - ${option.variantOption.nameTh}` : ""}`,
            price: option.finalPrice,
            image: thumbnail,
            stock: option.inventory?.stock,
            unit: product.unit,
            categoryId: product.categories?.id,
          };
        });
      }
      
      // ถ้าไม่มี variant
      const mainOption = product.productOptions?.[0];
      const thumbnail = mainOption?.productFiles?.url || "/images/products/no-image.jpg";
      
      return [{
        id: product.id,
        name: product.nameTh,
        price: mainOption?.finalPrice || 0,
        image: thumbnail,
        stock: mainOption?.inventory?.stock,
        unit: product.unit,
        categoryId: product.categories?.id,
      }];
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = mappedProducts;

    // Filter by category
    if (selectedCategory) {
      const category = categories.find((c: any) => c.id === selectedCategory);
      const subCategoryIds = category?.subCategories?.map((s: any) => s.id) || [];
      
      filtered = filtered.filter((p:any) => 
        p.categoryId === selectedCategory || subCategoryIds.includes(p.categoryId)
      );
    }

    // Filter by search
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter((p:any) => p.name.toLowerCase().includes(term));
    }

    return filtered;
  }, [mappedProducts, selectedCategory, search, categories]);

  const addToOrder = (product: typeof mappedProducts[0]) => {
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

  const removeFromOrder = (productId: string) => {
    setOrder((prev) => prev.map((item) => (item.id === productId ? { ...item, qty: item.qty - 1 } : item)).filter((item) => item.qty > 0));
  };

  const total = order.reduce((sum, item) => sum + item.price * item.qty, 0);

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
            mt: 5,
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
