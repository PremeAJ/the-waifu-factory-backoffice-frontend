import { AppBarProps } from "@mui/material";
import { FC, ReactNode } from "react";
import { useProfile } from "@/common/contexts/ProfileContext";
import AppBarStyled from "../shared/AppBarStyled";

const BaseAppBar: FC<AppBarProps & { children?: ReactNode }> = (props) => {
  const { appearance } = useProfile();
  const isCardShadow = appearance?.isCardShadow ?? true;

  return <AppBarStyled isCardShadow={isCardShadow} {...props} />;
};

export default BaseAppBar;