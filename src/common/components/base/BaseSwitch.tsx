import React from "react";
import { Switch, SwitchProps, Stack, Typography, Box, Tooltip, ClickAwayListener } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import BaseLabel from "./BaseLabel";
import { IconHelpCircle } from "@tabler/icons-react";
import useIsMobile from "@/common/utils/state/isMobile"; // ใช้ตรวจมือถือ

// StyledSwitch remains for the visual appearance of the switch itself
const StyledSwitch = styled((props: SwitchProps) => <Switch {...props} />)(({ theme }) => ({
  "&.MuiSwitch-root": {
    width: "68px",
    height: "49px",
  },
  "&  .MuiButtonBase-root": {
    top: "6px",
    left: "6px",
  },
  "&  .MuiButtonBase-root.Mui-checked .MuiSwitch-thumb": {
    backgroundColor: theme.palette.primary.main,
  },
  "& .MuiSwitch-thumb": {
    width: "18px",
    height: "18px",
    borderRadius: "6px",
  },
  "& .MuiSwitch-track": {
    backgroundColor: theme.palette.grey[200],
    opacity: 1,
    borderRadius: "5px",
  },
  "& .MuiSwitch-switchBase": {
    "&.Mui-checked": {
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.primary.main,
        opacity: 0.18,
      },
    },
  },
}));

// --- New Flexible Props Interface ---
interface BaseSwitchProps extends SwitchProps {
  name?: string; // name is now optional
  formik?: any;
  label?: string;
  tooltip?: string;
  border?: boolean;
  labelPosition?: "top" | "inside" | "side";
}

// --- Helper to get nested value from Formik ---
const getIn = (obj: any, path: string) => {
  if (!obj || !path) return undefined;
  const parts = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
  return parts.reduce((acc: any, key: string) => (acc != null ? acc[key] : undefined), obj);
};

// --- Helper for Label with Tooltip (now uses ClickAwayListener for mobile toggle) ---
const LabelWithTooltip: React.FC<{ text: string; tooltip?: string }> = ({ text, tooltip }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  const handleToggleTooltip = (e: React.MouseEvent) => {
    if (!tooltip || !isMobile) return;
    // Prevent focusing input / propagating clicks when toggling on mobile
    e.preventDefault();
    e.stopPropagation();
    setOpen((o) => !o);
  };

  const handleClose = () => setOpen(false);

  const content = (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: tooltip && isMobile ? "pointer" : undefined }}
      onClick={handleToggleTooltip}
      role={tooltip && isMobile ? "button" : undefined}
      tabIndex={tooltip && isMobile ? 0 : undefined}
    >
      <Typography variant="subtitle1" color="textSecondary">
        {text}
      </Typography>
      {tooltip && (
        <IconHelpCircle size={16} style={{ color: theme.palette.info.main }} />
      )}
    </span>
  );

  if (!tooltip) return content;

  // Mobile: controlled tooltip with ClickAwayListener (tap to open, tap outside to close)
  if (isMobile) {
    return (
      <ClickAwayListener onClickAway={handleClose}>
        <Tooltip
          title={tooltip}
          placement="top"
          arrow
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
    );
  }

  // Desktop: regular hover tooltip
  return (
    <Tooltip title={tooltip} placement="top" arrow>
      {content}
    </Tooltip>
  );
};

// --- Main Component ---
const BaseSwitch: React.FC<BaseSwitchProps> = ({
  name,
  formik,
  label,
  tooltip,
  border = false,
  labelPosition = "side", // Default to 'side' for non-bordered switches
  ...rest
}) => {
  // Determine the checked state: prioritize formik, then fall back to direct prop
  const isControlledByFormik = formik && name;
  const checkedValue = isControlledByFormik ? getIn(formik.values, name) ?? false : rest.checked;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckedState = event.target.checked;
    // Update formik if it's being used
    if (isControlledByFormik) {
      formik.setFieldValue(name, newCheckedState);
    }
    // Always call the onChange from props if it exists (for non-formik usage)
    if (rest.onChange) {
      // keep signature compatible with MUI: (event, checked)
      (rest.onChange as any)(event, newCheckedState);
    }
  };

  const switchElement = <StyledSwitch {...rest} name={name} checked={checkedValue} onChange={handleChange} />;

  // --- Rendering Logic ---

  // Case 1: Bordered Box (like a TextField)
  if (border) {
    const effectiveLabelPosition = labelPosition === "side" ? "top" : labelPosition; // 'side' is not valid for bordered, default to 'top'
    return (
      <Box mt={5}>
        {label && effectiveLabelPosition === "top" && <BaseLabel tooltip={tooltip}>{label}</BaseLabel>}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            height: "44px",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            px: 2,
            ...rest.sx,
          }}
        >
          {label && effectiveLabelPosition === "inside" && <LabelWithTooltip text={label} tooltip={tooltip} />}
          {/* This Box is a spacer to push the switch to the right if there's no inside label */}
          {(!label || effectiveLabelPosition !== "inside") && <Box flexGrow={1} />}
          {switchElement}
        </Stack>
      </Box>
    );
  }

  // Case 2: No Border (standard switch with label)
  return (
    <Stack direction="row" alignItems="center" >
      {switchElement}
      {label && labelPosition === "side" && <LabelWithTooltip text={label} tooltip={tooltip} />}
    </Stack>
  );
};

export default BaseSwitch;