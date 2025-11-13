"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { BaseDialog, BaseNumberField } from "@/common/components/base";

interface StockEditDialogProps {
  open: boolean;
  onClose: () => void;
  item: any | null;
  onSave: (stock: number) => void;
}

const StockEditDialog: React.FC<StockEditDialogProps> = ({ open, onClose, item, onSave }) => {
  const [stock, setStock] = useState<number>(0);

  useEffect(() => {
    if (open && item) {
      setStock(item.inventory?.stock ?? item.stock ?? 0);
    }
  }, [open, item]);

  const handleConfirm = () => {
    onSave(stock);
  };

  if (!item) return null;

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="แก้ไขจำนวนสต็อก"
      content={
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              สินค้า
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {item.nameTh || item.sku || "-"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              SKU
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {item.sku || "-"}
            </Typography>
          </Box>

          <Box>
            <BaseNumberField
              name={item.id}
              label="จำนวนสต็อก"
              tooltip="จำนวนสินค้าที่มีอยู่ในคลัง"
              fullWidth
              suffix={item.unit}
              allowDecimal={false}
              allowNegative={false}
              placeholder="0"
              value={stock}
              onChange={(val) => setStock(Number(val) || 0)}
            />
          </Box>
        </Stack>
      }
      confirmText="บันทึก"
      cancelText="ยกเลิก"
      onConfirm={handleConfirm}
    />
  );
};

export default StockEditDialog;
