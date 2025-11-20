"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { BaseDialog, BaseNumberField } from "@/common/components/base";
import { useProducts } from "@/common/contexts/ProductsContext"; // added
import { useDialog } from "@/common/contexts/DialogContext"; // optional for error handling

interface StockEditDialogProps {
  open: boolean;
  onClose: () => void;
  item: any | null;
  onSave: (stock: number) => void;
}

const StockEditDialog: React.FC<StockEditDialogProps> = ({ open, onClose, item, onSave }) => {
  const [stock, setStock] = useState<number>(0);
  const { updateInventory,actionLoading } = useProducts(); 
  const { showError } = useDialog();

  useEffect(() => {
    if (open && item) {
      setStock(item.inventory?.stock ?? item.stock ?? 0);
    }
  }, [open, item]);

  const handleConfirm = async () => {
    try {
      await updateInventory(item.productOptionId, { quantity: stock } as any);
      onSave(stock);
      onClose();
    } catch (err: any) {
      if (showError) {
        showError({ message: err?.message ?? "Failed to update stock" });
      }
    }
  };

  const handleInventoryChange = useCallback((e: any) => {
  setStock(e.target.value);
}, []);

  if (!item) return null;

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="แก้ไขจำนวนสต็อก"
      loading={actionLoading}
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
              onChange={handleInventoryChange}
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
