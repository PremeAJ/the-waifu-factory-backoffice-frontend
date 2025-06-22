"use client";
import { usePathname, useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import BaseFab from "@/components/base/BaseFab";

const isStandalone = () =>
  typeof window !== "undefined" && (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone);

const MobileBackButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = ["/", "/dashboard"];
  if (!isStandalone() || basePath.includes(pathname)) return null;

  return (
    <BaseFab fadeDirection="left" sx={{ position: "fixed", bottom: 16, left: 16, zIndex: 1300 }} onClick={() => router.back()} aria-label="back">
      <IconArrowLeft />
    </BaseFab>
  );
};

export default MobileBackButton;
