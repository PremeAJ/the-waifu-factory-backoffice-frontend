"use client";
import React from "react";
import BaseFab from "./BaseFab";
import { FabProps } from "@mui/material/Fab";

export enum FloatingButtonPosition {
  TOP_LEFT = "top-left",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_RIGHT = "bottom-right",
  CENTER_RIGHT = "center-right",
  CENTER_LEFT = "center-left",
}

interface BaseFloatingButtonProps extends Omit<FabProps, "children"> {
  icon: React.ReactNode;
  position?: FloatingButtonPosition;
  // sx prop is already included in FabProps
}

const getPositionStyles = (position: FloatingButtonPosition) => {
  switch (position) {
    case FloatingButtonPosition.TOP_LEFT:
      return { top: 16, left: 16 };
    case FloatingButtonPosition.TOP_RIGHT:
      return { top: 16, right: 16 };
    case FloatingButtonPosition.BOTTOM_LEFT:
      return { bottom: 16, left: 16 };
    case FloatingButtonPosition.BOTTOM_RIGHT:
      return { bottom: 16, right: 16 };
    case FloatingButtonPosition.CENTER_RIGHT:
      return { top: "50%", right: 16, transform: "translateY(-50%)" };
    case FloatingButtonPosition.CENTER_LEFT:
      return { top: "50%", left: 16, transform: "translateY(-50%)" };
    default:
      return { top: 16, right: 16 };
  }
};

const BaseFloatingButton: React.FC<BaseFloatingButtonProps> = ({ 
  icon, 
  onClick, 
  position = FloatingButtonPosition.TOP_RIGHT, 
  sx, 
  ...rest 
}) => {
  const positionStyles = getPositionStyles(position);

  return (
    <BaseFab
      onClick={onClick}
      sx={{
        position: "fixed",
        ...positionStyles,
        ...sx,
      }}
      {...rest}
    >
      {icon}
    </BaseFab>
  );
};

export default BaseFloatingButton;
