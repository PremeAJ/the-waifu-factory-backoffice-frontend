import React, { FC } from "react";
import AppBarStyled from "../shared/AppBarStyled";
import { AppBarProps } from "@mui/material";
import { useProfile } from "@/common/contexts/ProfileContext";

const BaseAppBar: FC<AppBarProps & { children?: React.ReactNode }> = (props) => {
  const { appearance } = useProfile(); // hook inside component — OK
  const isCardShadow = appearance?.isCardShadow ?? true;

  return <AppBarStyled isCardShadow={isCardShadow} {...props} />;
};

export default BaseAppBar;