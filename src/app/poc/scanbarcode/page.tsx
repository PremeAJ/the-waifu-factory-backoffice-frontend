"use client";

import BarcodeScanner from "@/components/barcode/BarcodeScanner";

export default function ScanBarcodePage() {
  return (
    <BarcodeScanner
      onScan={(result) => {
        // ทำอะไรก็ได้กับผลลัพธ์ เช่น alert หรือบันทึกลง state
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
