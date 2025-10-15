import { AppBar, styled } from "@mui/material";
import config from "@/common/contexts/setting/config";

const { topbarHeight } = config || {};

// don't call hooks here — accept isCardShadow prop and avoid forwarding it to DOM
const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "isCardShadow",
})<{ isCardShadow?: boolean }>(({ theme, isCardShadow = true }) => ({
  boxShadow: isCardShadow
    ? theme.palette.mode === "dark"
      ? "0 6px 18px -6px rgba(255,255,255,0.06)"
      : "0 4px 16px -4px rgba(0, 0, 0, 0.1)"
    : "none",
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
