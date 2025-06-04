"use client";
import { usePathname, useRouter } from "next/navigation";
import { Fab } from "@mui/material";
import { IconArrowLeft } from "@tabler/icons-react";

// เช็คว่าเปิดในโหมด PWA (Standalone) หรือไม่
const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone);

const MobileBackButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = ["/","/dashboard"]
  if (!isStandalone() || basePath.includes(pathname)) return null;

  return (
    <Fab
      color="primary"
      size="medium"
      sx={{
        position: "fixed",
        bottom: 16,
        left: 16,
        zIndex: 1300,
        boxShadow: 3,
      }}
      onClick={() => router.back()}
      aria-label="back"
    >
      <IconArrowLeft />
    </Fab>
  );
};

export default MobileBackButton;
