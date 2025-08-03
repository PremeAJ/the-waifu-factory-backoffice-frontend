"use client";
import React from "react";
import BaseFab from "./BaseFab";
import { FabProps } from "@mui/material/Fab";

interface BaseFloatingButtonProps extends Omit<FabProps, "children"> {
  icon: React.ReactNode;
  // sx prop is already included in FabProps
}

const BaseFloatingButton: React.FC<BaseFloatingButtonProps> = ({ icon, onClick, sx, ...rest }) => {
  return (
    <BaseFab
      onClick={onClick}
      sx={{
        position: "fixed",
        zIndex: 200,
        top: 16,
        right: 16,
        ...sx,
      }}
      {...rest}
    >
      {icon}
    </BaseFab>
  );
};

export default BaseFloatingButton;
