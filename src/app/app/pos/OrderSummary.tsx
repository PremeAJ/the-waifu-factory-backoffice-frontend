import React from "react";
import { Card, CardContent, Typography, Divider, Box, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import BaseButton from "@/components/base/BaseButton";

export default function OrderSummary({ order, addToOrder, removeFromOrder, setOrder, total, isMobile }: any) {
  return (
    <Card sx={{ height: isMobile ? "auto" : "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: isMobile ? 1 : 2 }}>
        <Typography variant="h6" gutterBottom>
          ออเดอร์ของคุณ
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ flex: 1, maxHeight: isMobile ? "none" : "50vh", overflow: isMobile ? "visible" : "auto" }}>
          {order.map((item: any) => {
            const isOutOfStock = item.stock !== undefined && item.qty >= item.stock;
            return (
              <Box key={item.id} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      overflow: "hidden",
                      bgcolor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} sizes="40px" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: isMobile ? 13 : 15 }}>{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ฿{item.price * item.qty}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center">
                  <IconButton size="small" onClick={() => removeFromOrder(item.id)} disabled={item.qty <= 1}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography component="span" sx={{ mx: 1 }}>
                    {item.qty}
                  </Typography>
                  <IconButton size="small" onClick={() => addToOrder(item)} disabled={isOutOfStock}>
                    <AddIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => setOrder((prev: any) => prev.filter((o: any) => o.id !== item.id))} sx={{ ml: 1 }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
          {order.length === 0 && (
            <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
              ยังไม่มีสินค้าในออเดอร์
            </Typography>
          )}
        </Box>
        <Box sx={{ mt: "auto" }}>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">รวม</Typography>
            <Typography variant="h5" color="primary">
              ฿{total}
            </Typography>
          </Box>
          <BaseButton
            variant="contained"
            sx={{ mt: 2, fontSize: isMobile ? 14 : 16, py: isMobile ? 1 : 2 }}
            disabled={order.length === 0}
            onClick={() => alert("ยืนยันออเดอร์!")}
          >
            ยืนยันออเดอร์
          </BaseButton>
        </Box>
      </CardContent>
    </Card>
  );
}