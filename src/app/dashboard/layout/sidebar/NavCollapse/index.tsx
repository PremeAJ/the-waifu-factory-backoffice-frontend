import { Box } from "@mui/material";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { isNull } from "lodash";
import { NavCollapseProps, NavGroup } from "@/common/utils/types/layout/sidebar";
import { styled, useTheme } from "@mui/material/styles";
import { Theme } from "@mui/material/styles";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useTranslation } from "react-i18next";
import Collapse from "@mui/material/Collapse";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NavItem from "../NavItem";
import React, { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
export default function NavCollapse({ menu, level, pathWithoutLastPart, pathDirect, hideMenu, onClick }: NavCollapseProps) {
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  const { isBorderRadius} = useProfile().appearance;
  const Icon = menu?.icon;
  const theme = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const menuIcon = Icon ? level > 1 ? <Icon stroke={1.5} size="1rem" /> : <Icon stroke={1.5} size="1.3rem" /> : null;

  const handleClick = () => {
    setOpen(!open);
  };

  // menu collapse for sub-levels
  React.useEffect(() => {
    setOpen(false);
    menu?.children?.forEach((item: NavGroup) => {
      if (item?.href === pathDirect) {
        setOpen(true);
      }
    });
  }, [pathDirect, menu.children]);

  const ListItemStyled = styled(ListItemButton)(() => ({
    marginBottom: "2px",
    padding: "8px 10px",
    paddingLeft: hideMenu ? "10px" : level > 2 ? `${level * 15}px` : "10px",
    backgroundColor: open && level < 2 ? theme.palette.primary.main : "",
    whiteSpace: "nowrap",
    "&:hover": {
      backgroundColor: pathDirect.includes(menu.href || "") || open ? theme.palette.primary.main : theme.palette.secondary.main,
      color: pathDirect.includes(menu.href || "") || open ? "white" : theme.palette.primary.contrastText,
    },
    color: open && level < 2 ? "white" : level > 1 && open ? theme.palette.primary.main : theme.palette.text.secondary,
    borderRadius: `${isBorderRadius}px`,
  }));

  // If Menu has Children
  const submenus = menu.children?.map((item: any) => {
    if (item.children) {
      return (
        <NavCollapse
          key={item?.id}
          menu={item}
          level={level + 1}
          pathWithoutLastPart={pathWithoutLastPart}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={onClick}
        />
      );
    } else {
      return (
        <Box sx={{ ml: 2 }} key={item.id}>
          <NavItem key={item.id} item={item} level={level + 1} pathDirect={pathDirect} hideMenu={hideMenu} onClick={lgDown ? onClick : isNull} />
        </Box>
      );
    }
  });

  return (
    <>
      <ListItemStyled onClick={handleClick} selected={pathWithoutLastPart === menu.href} key={menu?.id}>
        <ListItemIcon
          sx={{
            minWidth: "36px",
            p: "3px 0 0 3px",
            color: "inherit",
          }}
        >
          {menuIcon}
        </ListItemIcon>
        <ListItemText color="inherit">{hideMenu ? "" : <>{t(`${menu.title}`)}</>}</ListItemText>
        {!open ? <IconChevronDown size="1rem" /> : <IconChevronUp size="1rem" />}
      </ListItemStyled>
      <Collapse in={open} timeout="auto">
        {submenus}
      </Collapse>
    </>
  );
}
