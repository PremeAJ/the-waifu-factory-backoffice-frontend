import { useMediaQuery } from "@mui/material";

const useIsPortrait = (): boolean => {
  return useMediaQuery("(orientation: portrait)");
};

export default useIsPortrait;
