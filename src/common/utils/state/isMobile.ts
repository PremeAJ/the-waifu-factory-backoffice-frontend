import { useTheme, useMediaQuery } from "@mui/material";

const useIsMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("lg"));
};

export default useIsMobile;