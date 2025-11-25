"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import BaseButton from "@/common/components/base/BaseButton/BaseButton";
import BarcodeDialog from "@/common/components/dialogs/BarcodeDialog";

export default function ScanBarcodePage() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ p: 3 }}>
      <BaseButton label="เปิด Barcode Dialog" onClick={handleOpen} />
      <BarcodeDialog
        open={open}
        onClose={handleClose}
        onScan={(result) => {
          console.log("Dialog scanned:", result);
        }}
      />
    </Box>
  );
}
