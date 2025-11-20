import React, { useState } from "react";
import {
  styled,
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import useIsMobile from "@/common/utils/state/isMobile";

interface StyledProps {
  expanded?: boolean;
}
const StyledSearchField = styled(
  TextField,
  { shouldForwardProp: (prop) => prop !== "expanded" }
)<StyledProps>(({ theme, expanded }) => {
  const outerRadius = theme.shape.borderRadius * 3;
  return {
    position: "fixed",
    top: 22,
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(600px, 90vw)",
    backgroundColor: theme.palette.mode === "dark" ? "rgba(30,30,30,0.7)" : "rgba(255,255,255,0.8)",
    borderRadius: outerRadius,
    boxShadow: theme.shadows[3],
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    zIndex: 200,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter,
    }),

    [theme.breakpoints.down("sm")]: {
      width: expanded ? "60vw" : "40vw",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: outerRadius,
      "& fieldset": {
        borderColor: theme.palette.grey[300],
        borderWidth: 1,
        borderRadius: outerRadius, 
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.light,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: 1.5,
      },
    },
  };
});

interface BaseSearchFieldProps extends Omit<TextFieldProps, "variant"> {
  onSearchChange: (value: string) => void;
  value: string;
}

const BaseSearchField: React.FC<BaseSearchFieldProps> = ({
  value,
  onSearchChange,
  placeholder = "ค้นหา",
  ...rest
}) => {
  const isMobile = useIsMobile();
  const [focused, setFocused] = useState(false);
  const expanded = isMobile && focused;

  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <StyledSearchField
      // เพิ่ม type และ enterKeyHint
      type="search"
      inputProps={{
        inputMode: "search",
        enterKeyHint: "search",
      }}
      expanded={expanded}
      variant="outlined"
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onSearchChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleClear}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
      {...rest}
    />
  );
};

export default BaseSearchField;
