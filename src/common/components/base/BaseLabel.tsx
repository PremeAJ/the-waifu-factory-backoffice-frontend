"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import { Tooltip, Typography, useTheme, useMediaQuery, ClickAwayListener } from "@mui/material";
import { IconInfoCircle } from "@tabler/icons-react";
import useIsMobile from "@/common/utils/state/isMobile";

interface BaseLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  tooltip?: string;
  sx?: any;
}

const BaseLabel = styled(
  ({ children, htmlFor, required, tooltip, ...props }: BaseLabelProps) => {
    const theme = useTheme();
    const isMobile = useIsMobile();
    const [open, setOpen] = React.useState(false);

    const handleToggleTooltip = (e: React.MouseEvent) => {
      if (!tooltip || !isMobile) return;
      // กันโฟกัส input และกันเมนู/คลิกอื่นๆ
      e.preventDefault();
      e.stopPropagation();
      setOpen((o) => !o);
    };

    const handleClose = () => setOpen(false);

    const content = (
      <span
        style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        onClick={handleToggleTooltip}
        role={tooltip && isMobile ? "button" : undefined}
        tabIndex={tooltip && isMobile ? 0 : undefined}
      >
        <span style={{ display: "inline-block", minWidth: 0 }}>{children}</span>
        {tooltip && (
          <IconInfoCircle
            width={20}
            color={theme.palette.info.main}
            cursor={"pointer"}
            style={{ padding: 4, marginLeft: 2 }}
          />
        )}
        {required && <span style={{ color: "#d32f2f" }}>*</span>}
      </span>
    );

    return (
      <Typography
        variant="subtitle1"
        fontWeight={600}
        component="label"
        htmlFor={htmlFor}
        {...props}
      >
        {tooltip ? (
          isMobile ? (
            <ClickAwayListener onClickAway={handleClose}>
              <Tooltip
                title={tooltip}
                placement="top"
                open={open}
                onClose={handleClose}
                disableHoverListener
                disableFocusListener
                disableTouchListener
                enterTouchDelay={0}
              >
                {content}
              </Tooltip>
            </ClickAwayListener>
          ) : (
            <Tooltip title={tooltip} placement="top">
              {content}
            </Tooltip>
          )
        ) : (
          content
        )}
      </Typography>
    );
  }
)(() => ({
  marginBottom: "5px",
  marginTop: "25px",
  display: "block",
  textAlign: "left",
}));

export default BaseLabel;
