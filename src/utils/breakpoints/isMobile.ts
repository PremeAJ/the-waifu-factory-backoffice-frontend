import { useTheme, useMediaQuery } from "@mui/material";

/**
 * ใช้สำหรับตรวจสอบว่าเป็น mobile (ต่ำกว่า md)
 * @returns boolean
 */
const useIsMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("lg"));
};

export default useIsMobile;