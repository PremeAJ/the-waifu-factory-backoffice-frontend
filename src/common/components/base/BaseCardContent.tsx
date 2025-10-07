import useIsMobile from "@/common/utils/state/isMobile";
import useIsPortrait from "@/common/utils/state/useIsPortrait";
import { CardContent, CardContentProps } from "@mui/material";
import React from "react";

const BaseCardContent: React.FC<CardContentProps> = ({ children, ...props }) => {
  const isMobie = useIsMobile();
  const isPortrait = useIsPortrait();
  const isMobilePortrait = isMobie && isPortrait;
  return (
    <CardContent {...props} sx={{ px: isMobilePortrait ? 0 : undefined, ...props.sx }}>
      {children}
    </CardContent>
  );
};

export default BaseCardContent;
