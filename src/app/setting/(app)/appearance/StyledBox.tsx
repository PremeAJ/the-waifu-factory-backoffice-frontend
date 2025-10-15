import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";

const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "selected" && prop !== "isCardShadow",
})<BoxProps & { selected?: boolean; isCardShadow?: boolean }>(({ theme, selected, isCardShadow = true }) => ({
  boxShadow: isCardShadow ? selected ? theme.shadows[8] : theme.shadows[2] : "none",
  padding: "20px",
  cursor: "pointer",
  justifyContent: "center",
  display: "flex",
  transition: "0.1s ease-in",
  border: "1px solid rgba(145, 158, 171, 0.12)",
  backgroundColor: selected ? theme.palette.primary.light : "transparent",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

export default StyledBox;
