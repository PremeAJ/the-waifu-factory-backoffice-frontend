import { ItemType } from "@/common/utils/types/layout/sidebar";
import { styled, useTheme } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
import { useProfile } from "@/common/contexts/ProfileContext";
import { useTranslation } from "react-i18next";
import Chip from '@mui/material/Chip';
import Link from "next/link";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from "react";
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import BaseTooltip from "@/common/components/base/BaseTooltip";

export default function NavItem({
  item,
  level,
  pathDirect,
  hideMenu,
  onClick,
}: ItemType) {
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const { isBorderRadius} = useProfile().appearance;
  const Icon = item?.icon;
  const theme = useTheme();
  const { t } = useTranslation();

  const itemIcon = Icon ? (
    (level ?? 1) > 1 ? (
      <Icon stroke={1.5} size="1rem" />
    ) : (
      <Icon stroke={1.5} size="1.3rem" />
    )
  ) : null;

  const ListItemStyled = styled(ListItemButton)(() => ({
    whiteSpace: "nowrap",
    marginBottom: "2px",
    padding: "8px 10px",
    borderRadius: `${isBorderRadius}px`,
    backgroundColor: (level ?? 1) > 1 ? "transparent !important" : "inherit",
    color:
      (level ?? 1) > 1 && pathDirect === item?.href
        ? `${theme.palette.primary.main}!important`
        : theme.palette.text.secondary,
    paddingLeft: hideMenu ? "10px" : (level ?? 2) > 2 ? `${(level ?? 1) * 15}px` : "10px",

    // smooth text enlargement on hover
    // target the ListItemText root and caption to increase title size slightly
    "& .MuiListItemText-root": {
      transition: "font-size 140ms ease, transform 140ms ease, color 140ms ease",
      fontSize: "0.95rem",
      lineHeight: 1.1,
    },
    "& .MuiTypography-caption": {
      transition: "opacity 120ms ease, transform 120ms ease",
      fontSize: "0.72rem",
    },

    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color:
        (level ?? 1) === 1
          ? theme.palette.primary.contrastText
          : theme.palette.primary.main,
      // enlarge text on hover (subtle)
      "& .MuiListItemText-root": {
        fontSize: "1.02rem",
        transform: "translateY(-1px)",
      },
      "& .MuiTypography-caption": {
        transform: "translateY(-1px)",
        opacity: 0.95,
      },
    },
    "&.Mui-selected": {
      color: (level ?? 1) === 1 ? theme.palette.primary.contrastText : "white",
      backgroundColor: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
        color: (level ?? 1) === 1 ? theme.palette.primary.contrastText : "white",
      },
    },
    // respect reduced motion preference
    "@media (prefers-reduced-motion: reduce)": {
      "& .MuiListItemText-root, & .MuiTypography-caption": {
        transition: "none",
        transform: "none",
      },
    },
  }));


  const content = (
    <ListItemStyled
      disabled={item?.disabled}
      selected={pathDirect === item?.href}
      onClick={lgDown ? onClick : undefined}
    >
      <ListItemIcon
        sx={{
          minWidth: hideMenu ? "unset" : "36px",
          p: "3px 0 0 3px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color:
            (level ?? 1) > 1 && pathDirect === item?.href
              ? `${theme.palette.primary.main}!important`
              : "inherit",
        }}
      >
        {itemIcon}
      </ListItemIcon>
      <ListItemText>
        {hideMenu ? "" : <>{t(`${item?.title}`)}</>}
        <br />
        {item?.subtitle ? (
          <Typography variant="caption">
            {hideMenu ? "" : item?.subtitle}
          </Typography>
        ) : (
          ""
        )}
      </ListItemText>
      {!item?.chip || hideMenu ? null : (
        <Chip
          color={(item?.chipColor as "default" | "error" | "primary" | "secondary" | "info" | "success" | "warning") || "default"}
          variant={(item?.variant as "filled" | "outlined") || "filled"}
          size="small"
          label={item?.chip}
        />
      )}
    </ListItemStyled>
  );

  return (
    <List component="li" disablePadding key={item?.id && item.title}>
      <Link href={item.href || ''}>
        {hideMenu ? (
          <BaseTooltip title={t(`${item?.title}`)} placement="right">
            <span>{content}</span>
          </BaseTooltip>
        ) : (
          content
        )}
      </Link>
    </List>
  );
}
