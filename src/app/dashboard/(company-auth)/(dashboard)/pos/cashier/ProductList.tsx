import React from "react";
import { Grid, Card, Box, Typography } from "@mui/material";
import Image from "next/image";
import BlockIcon from "@mui/icons-material/Block";
import BaseScrollbar from "@/common/components/base/BaseScrollBar";

export default function ProductList({ filteredProducts, order, addToOrder, isMobile }: any) {
  return (
    <BaseScrollbar
      sx={{
        maxHeight: isMobile ? "none" : "calc(100vh - 180px)",
        overflow: isMobile ? "visible" : "auto",
      }}
    >
      <Grid
        container
        spacing={isMobile ? 1 : 2}
        sx={{
          alignItems: "flex-start",
          userSelect: "none",
        }}
      >
        {filteredProducts.map((product: any) => {
          const inOrder = order.find((item: any) => item.id === product.id)?.qty || 0;
          const isOutOfStock = product.stock !== undefined && product.stock - inOrder <= 0;
          return (
            <Grid size={{ xs: 4, sm: 3, md: 2 }} key={product.id}>
              <Card
                variant="outlined"
                onClick={() => !isOutOfStock && addToOrder(product)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 0,
                  height: isMobile ? 140 : 220,
                  overflow: "hidden",
                  cursor: isOutOfStock ? "not-allowed" : "pointer",
                  opacity: isOutOfStock ? 0.5 : 1,
                  transition: "box-shadow 0.2s",
                  "&:hover": {
                    boxShadow: isOutOfStock ? undefined : 6,
                    bgcolor: isOutOfStock ? undefined : "grey.100",
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
                    {product.stock !== undefined ? `คงเหลือ ${product.stock - inOrder}` : ""}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          );
        })}
        {filteredProducts.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
              ไม่พบสินค้า
            </Typography>
          </Grid>
        )}
      </Grid>
    </BaseScrollbar>
  );
}