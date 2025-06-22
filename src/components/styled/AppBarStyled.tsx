import config from "@/context/setting/config";
import { AppBar, styled } from "@mui/material";
const TopbarHeight = config.topbarHeight;

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: "none",
  background: theme.palette.mode === "dark" ? "rgba(30, 30, 30, 0.6)" : "rgba(255, 255, 255, 0.6)",
  justifyContent: "center",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(255,255,255,0.18)",
  [theme.breakpoints.up("lg")]: {
    minHeight: TopbarHeight,
  },
}));

export default AppBarStyled;
