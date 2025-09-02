import { usePathname } from "next/navigation";

const useIsSubMenu = () => {
  const manualBackPrefixes = ["/auth", "/dashboard/auth", "/dashboard/setting", "/create-company"];
  const pathname = usePathname();
  return pathname.split("/").length > 3 || manualBackPrefixes.some((prefix) => pathname.startsWith(prefix));
};

export default useIsSubMenu;
