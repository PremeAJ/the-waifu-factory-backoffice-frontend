"use client";

import BarcodeScanner from "@/common/components/barcode/BarcodeScanner";

export default function ScanBarcodePage() {
  return (
    <BarcodeScanner
      onScan={(result) => {
        console.log("Scanned:", result);
      }}
      onError={(err) => {
        // handle error
        console.error(err);
      }}
      showResult={true}
    />
  );
}
