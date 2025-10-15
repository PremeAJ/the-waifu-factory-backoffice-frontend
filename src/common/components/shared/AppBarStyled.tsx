import config from "@/common/contexts/setting/config";
import { AppBar, styled } from "@mui/material";
const {topbarHeight, isCardShadow} = config || {};

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: isCardShadow ? "0 4px 16px -4px rgba(0, 0, 0, 0.1)" :"none",
  background: theme.palette.mode === "dark" ? "rgba(30, 30, 30, 0.6)" : "rgba(255, 255, 255, 0.6)",
  justifyContent: "center",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  borderBottom: "1px solid rgba(255,255,255,0.18)",
  [theme.breakpoints.up("lg")]: {
    minHeight: topbarHeight,
  },
}));

export default AppBarStyled;
