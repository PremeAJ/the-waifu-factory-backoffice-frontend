"use client";
import { usePathname, useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import BaseFab from "@/components/base/BaseFab";
import { useEffect, useState } from "react";

const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone);

const basePath = ["/", "/dashboard"];

const MobileBackButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() && !basePath.includes(pathname)) {
      setShow(true);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [pathname]);

  const handleExited = () => setShow(false);

  if (!show) return null;

  return (
    <BaseFab
      fadeDirection="left"
      sx={{ position: "fixed", bottom: 16, left: 16, zIndex: 9999 }}
      onClick={() => router.back()}
      aria-label="back"
      open={visible}
      onExited={handleExited}
    >
      <IconArrowLeft />
    </BaseFab>
  );
};

export default MobileBackButton;
