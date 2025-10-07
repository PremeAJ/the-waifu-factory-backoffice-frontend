import { CardContent, CardContentProps } from "@mui/material";
import React from "react";

const BaseCardContent: React.FC<CardContentProps> = ({ children, ...props }) => {
  return (
    <CardContent {...props} sx={{ px: 0, ...props.sx }}>
      {children}
    </CardContent>
  );
};

export default BaseCardContent;
