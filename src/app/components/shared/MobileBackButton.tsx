"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Fab, useTheme, useMediaQuery } from "@mui/material";
import { IconArrowLeft } from "@tabler/icons-react";

const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone);

const MobileBackButton = () => {
  const [show, setShow] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.down("lg"));
  const path = usePathname();
  const basePath = ['/','/dashboard']
  useEffect(() => {
    const check = () => {
      const hasHistory = typeof window !== "undefined" && window.history.length > 1;
      setShow((isStandalone() || lgUp) && hasHistory);
      setCanGoBack(hasHistory);
    };
    check();
    window.addEventListener("popstate", check);
    return () => window.removeEventListener("popstate", check);
  }, [lgUp]);

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
