"use client";
import { FabProps } from "@mui/material/Fab";
import { Badge } from "@mui/material";
import { IconPlus, IconDeviceFloppy, IconX, IconFilter } from "@tabler/icons-react";
import BaseFab from "./BaseFab";
import React from "react";

export enum FloatingButtonPosition {
  TOP_LEFT = "top-left",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_RIGHT = "bottom-right",
  CENTER_RIGHT = "center-right",
  CENTER_LEFT = "center-left",
}

interface BaseFloatingButtonProps extends Omit<FabProps, "children"> {
  icon?: React.ReactNode;
  position?: FloatingButtonPosition;
  preset?: "create" | "filter" | "save" | "cancel";
  badgeContent?: number;
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
      return { top: "50%", right: 16 };
    case FloatingButtonPosition.CENTER_LEFT:
      return { top: "50%", left: 16 };
    default:
      return { top: 16, right: 16 };
  }
};

const presetMap: Record<
  NonNullable<BaseFloatingButtonProps["preset"]>,
  { position: FloatingButtonPosition; icon: React.ReactNode; color: FabProps["color"] }
> = {
  create: { position: FloatingButtonPosition.BOTTOM_RIGHT, icon: <IconPlus />, color: "primary" },
  filter: { position: FloatingButtonPosition.TOP_RIGHT, icon: <IconFilter />, color: "primary" },
  save: { position: FloatingButtonPosition.BOTTOM_RIGHT, icon: <IconDeviceFloppy />, color: "info" },
  cancel: { position: FloatingButtonPosition.BOTTOM_LEFT, icon: <IconX />, color: "error" },
};

const BaseFloatingButton: React.FC<BaseFloatingButtonProps> = ({ icon, onClick, position, preset, sx, color, badgeContent = 0, ...rest }) => {
  // preset provides defaults, explicit props override preset
  const presetDefaults = preset ? presetMap[preset] : undefined;
  const finalPosition = position ?? presetDefaults?.position ?? FloatingButtonPosition.TOP_RIGHT;
  const finalIcon = icon ?? presetDefaults?.icon ?? null;
  const finalColor = color ?? presetDefaults?.color ?? "primary";
  const positionStyles = getPositionStyles(finalPosition);

  const fab = (
    <BaseFab
      onClick={onClick}
      color={finalColor}
      sx={{
        position: "fixed",
        ...positionStyles,
        ...sx,
      }}
      {...rest}
    >
      <Badge badgeContent={badgeContent} color="error">
        {finalIcon}
      </Badge>
    </BaseFab>
  );
  return fab;
};

export default BaseFloatingButton;
