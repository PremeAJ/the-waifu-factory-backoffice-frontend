import { ListItemIcon, styled, useTheme } from "@mui/material";
import Link from "next/link";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/common/contexts/ProfileContext";
import BaseTooltip from "@/common/components/base/BaseTooltip";

type NavItemProps = {
  item: any;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  hideMenu?: any;
  pathDirect: string;
  level?: number;
};

const NavItem = ({ item, level = 1, pathDirect, onClick, hideMenu }: NavItemProps) => {
  const lgDown = hideMenu;
  const theme = useTheme();
  const { t } = useTranslation();
  const { isBorderRadius } = useProfile().appearance;
  const Icon = item?.icon;
  const itemIcon = item?.icon ? <Icon stroke={1.5} size="1.3rem" /> : null;

  const ListItemStyled = styled(ListItemButton)(() => ({
    whiteSpace: "nowrap",
    marginBottom: "2px",
    padding: "8px 10px",
    borderRadius: `${isBorderRadius}px`,
    backgroundColor: level > 1 ? "transparent !important" : "inherit",
    color:
      level > 1 && pathDirect === item?.href
        ? `${theme.palette.primary.main}!important`
        : theme.palette.text.secondary,
    paddingLeft: hideMenu ? "10px" : level > 2 ? `${level * 15}px` : "10px",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    "&.Mui-selected": {
      color: "white",
      backgroundColor: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
        color: "white",
      },
    },
  }));

  return (
    <>
      {hideMenu ? (
        <BaseTooltip title={t(`${item?.title}`)} placement="right">
          <span>
            <Link href={item.href || ""} style={{ textDecoration: "none" }}>
              <ListItemStyled
                disabled={item?.disabled}
                selected={pathDirect === item?.href}
                onClick={onClick}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "36px",
                    p: "3px 0",
                    color: item.color || "inherit",
                  }}
                >
                  {itemIcon}
                </ListItemIcon>
                <ListItemText sx={{ display: lgDown ? "none" : "block" }}>{""}</ListItemText>
              </ListItemStyled>
            </Link>
          </span>
        </BaseTooltip>
      ) : (
        <Link href={item.href || ""} style={{ textDecoration: "none" }}>
          <ListItemStyled
            disabled={item?.disabled}
            selected={pathDirect === item?.href}
            onClick={onClick}
          >
            <ListItemIcon
              sx={{
                minWidth: "36px",
                p: "3px 0",
                color: item.color || "inherit",
              }}
            >
              {itemIcon}
            </ListItemIcon>
            <ListItemText sx={{ display: lgDown ? "none" : "block" }}>
              {hideMenu ? "" : <>{t(`${item?.title}`)}</>}
            </ListItemText>
          </ListItemStyled>
        </Link>
      )}
    </>
  );
};

export default NavItem;