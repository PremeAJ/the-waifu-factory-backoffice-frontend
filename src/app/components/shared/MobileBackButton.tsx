"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Fab, useTheme } from "@mui/material";
import { IconArrowLeft } from "@tabler/icons-react";

// เช็คว่าเปิดในโหมด PWA (Standalone) หรือไม่
const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone);

const MobileBackButton = () => {
  const [show, setShow] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const path = usePathname();
  const basePath = ['/','/dashboard']
  
  useEffect(() => {
    const check = () => {
      const hasHistory = typeof window !== "undefined" && window.history.length > 1;
      // เช็คเฉพาะว่าเป็น PWA mode และมี history
      setShow(isStandalone() && hasHistory);
      setCanGoBack(hasHistory);
    };
    
    check();
    window.addEventListener("popstate", check);
    return () => window.removeEventListener("popstate", check);
  }, []); // ลบการพึ่งพา lgUp

  if (!show || !canGoBack || basePath.includes(path)) return null;

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
