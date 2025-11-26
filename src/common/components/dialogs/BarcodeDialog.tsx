"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import BaseDialog from "@/common/components/base/BaseDialog";
import BarcodeScanner, { ScanResult } from "@/common/components/barcode/BarcodeScanner";

interface BarcodeDialogProps {
  open: boolean;
  onClose: () => void;
  onScan?: (result: ScanResult) => void;
  showResult?: boolean;
  fullscreen?: boolean;
}

const BarcodeDialog: React.FC<BarcodeDialogProps> = ({ open, onClose, onScan, showResult = true, fullscreen = true }) => {
  const [latest, setLatest] = useState<ScanResult | null>(null);
  const handleScan = (r: ScanResult) => {
    setLatest(r);
    onScan?.(r);
  };

  const content = (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <BarcodeScanner active={open} onScan={handleScan} onError={(e) => console.error("Barcode error:", e)} showResult={showResult} />
    </Box>
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="สแกนบาร์โค้ด"
      content={content}
      noAction={true}
      showCloseButton={true}
      fullScreen={fullscreen}
    />
  );
};

export default BarcodeDialog;