import React, { useMemo, useState } from "react";
import { Grid, Card, Box, Typography, Divider } from "@mui/material";
import Image from "next/image";
import BlockIcon from "@mui/icons-material/Block";
import BaseScrollbar from "@/common/components/base/BaseScrollBar";
import { useCategories } from "@/common/contexts/CategoriesContext";
import { renderTablerIcon } from "@/common/utils/icon/getTablerIcon";

export default function ProductList({ filteredProducts, order, addToOrder, isMobile }: any) {
  const { categories } = useCategories();
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  // จัดกลุ่มสินค้าตามหมวดหมู่
  const groupedProducts = useMemo(() => {
    const groups: Record<string, { category: any; products: any[] }> = {};

    filteredProducts.forEach((product: any) => {
      const categoryId = product.categoryId || "uncategorized";
      
      if (!groups[categoryId]) {
        const category = categories.find((c: any) => c.id === categoryId);
        const parentCategory = categories.find((c: any) => 
          c.subCategories?.some((sub: any) => sub.id === categoryId)
        );
        const subCategory = parentCategory?.subCategories?.find((sub: any) => sub.id === categoryId);
        
        groups[categoryId] = {
          category: subCategory || category || { id: categoryId, nameTh: "ไม่มีหมวดหมู่" },
          products: [],
        };
      }
      
      groups[categoryId].products.push(product);
    });

    return Object.values(groups);
  }, [filteredProducts, categories]);

  const handleProductClick = (product: any) => {
    const isOutOfStock = product.stock !== undefined && product.stock - (order.find((item: any) => item.id === product.id)?.qty || 0) <= 0;
    
    if (!isOutOfStock) {
      setActiveProductId(product.id);
      addToOrder(product);
      setTimeout(() => setActiveProductId(null), 150);
    }
  };

  return (
    <BaseScrollbar
      sx={{
        maxHeight: isMobile ? "none" : "calc(100vh - 180px)",
        overflow: isMobile ? "visible" : "auto",
      }}
    >
      <Box sx={{ pb: 2 }}>
        {groupedProducts.map((group, groupIndex) => (
          <Box key={group.category.id} sx={{ mb: 3 }}>
            {/* Category Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                pb: 1,
                borderBottom: "2px solid",
                borderColor: group.category.color || "primary.main",
              }}
            >
              {group.category.icon && renderTablerIcon(group.category.icon, {
                size: 24,
                color: group.category.color || undefined,
              })}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: isMobile ? 16 : 18,
                  color: group.category.color || "text.primary",
                }}
              >
                {group.category.nameTh}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  ml: 1,
                  color: "text.secondary",
                  fontSize: isMobile ? 11 : 13,
                }}
              >
                ({group.products.length} รายการ)
              </Typography>
            </Box>

            {/* Products Grid */}
            <Grid
              container
              spacing={isMobile ? 1 : 2}
              sx={{
                alignItems: "flex-start",
                userSelect: "none",
              }}
            >
              {group.products.map((product: any) => {
                const inOrder = order.find((item: any) => item.id === product.id)?.qty || 0;
                const isOutOfStock = product.stock !== undefined && product.stock - inOrder <= 0;
                const isActive = activeProductId === product.id;
                
                return (
                  <Grid size={{ xs: 6, sm: 3, md: 2 }} key={product.id}>
                    <Card
                      variant="outlined"
                      onClick={() => handleProductClick(product)}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 0,
                        height: isMobile ? 140 : 220,
                        overflow: "hidden",
                        cursor: isOutOfStock ? "not-allowed" : "pointer",
                        opacity: isOutOfStock ? 0.5 : 1,
                        transition: "all 0.18s",
                        ...(isActive && {
                          transform: "scale(0.96)",
                          boxShadow: 6,
                          bgcolor: "grey.100",
                        }),
                        "@media (hover: hover)": {
                          "&:hover": {
                            boxShadow: isOutOfStock ? undefined : 6,
                            bgcolor: isOutOfStock ? undefined : "grey.100",
                            transform: isOutOfStock ? undefined : "scale(1.02)",
                          },
                          "&:active": {
                            transform: isOutOfStock ? undefined : "scale(0.96)",
                          },
                        },
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: isMobile ? 60 : 120,
                          overflow: "hidden",
                          bgcolor: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          borderRadius: 0,
                        }}
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 600px) 100vw, 33vw"
                        />
                        {isOutOfStock && (
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              bgcolor: "rgba(0,0,0,0.45)",
                              color: "#fff",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 2,
                              fontWeight: "bold",
                              fontSize: 16,
                              letterSpacing: 1,
                            }}
                          >
                            <BlockIcon sx={{ fontSize: 32, mb: 0.5 }} />
                            สินค้าหมด
                          </Box>
                        )}
                      </Box>
                      <Box
                        sx={{
                          flex: 1,
                          width: "100%",
                          p: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          gutterBottom
                          align="center"
                          sx={{ fontSize: isMobile ? 12 : 14 }}
                        >
                          {product.name}
                        </Typography>
                        <Typography
                          color="text.secondary"
                          gutterBottom
                          align="center"
                          sx={{ fontSize: isMobile ? 11 : 13 }}
                        >
                          ฿{product.price}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={isOutOfStock ? "error" : "text.secondary"}
                          sx={{ fontSize: 11, mt: 0.5 }}
                        >
                          {product.stock !== undefined 
                            ? `คงเหลือ ${product.stock - inOrder} ${product.unit || ""}` 
                            : ""
                          }
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ))}

        {filteredProducts.length === 0 && (
          <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
            ไม่พบสินค้า
          </Typography>
        )}
      </Box>
    </BaseScrollbar>
  );
}