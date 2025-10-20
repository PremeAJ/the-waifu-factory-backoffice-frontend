"use client";
import { IconEye, IconEyeOff, IconSearch, IconX, IconInfoCircle } from "@tabler/icons-react";
import { IsLanguage } from "@/common/contexts/ProfileContext/interfaces/interface";
import { ReactNode, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { TextField, TextFieldProps, IconButton, InputAdornment, Tooltip, Skeleton } from "@mui/material";
import BaseLabel from "./BaseLabel";

interface CustomTextFieldProps extends Omit<TextFieldProps, "name"> {
  name: string;
  label?: string;
  placeholder?: string;
  formik?: any;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  required?: boolean;
  tooltip?: string;
  loading?: boolean;
  labelIcon?: ReactNode;
  lang?: IsLanguage;
}

export const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-input::-webkit-input-placeholder": {
    color: theme.palette.text.secondary,
    opacity: "0.8",
  },
  "& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder": {
    color: theme.palette.text.secondary,
    opacity: "1",
  },
  "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.grey[200],
  },
  "& .Mui-disabled:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.grey[200],
  },
  "& .MuiOutlinedInput-root.Mui-disabled:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.grey[200],
  },
  "& input[type=password]": {
    "&::-ms-reveal": {
      display: "none",
    },
    "&::-ms-clear": {
      display: "none",
    },
  },
  "& input[type=search]": {
    "&::-webkit-search-cancel-button": {
      display: "none",
    },
    "&::-webkit-search-decoration": {
      display: "none",
    },
    "&::-ms-clear": {
      display: "none",
    },
  },
}));

const BaseTextField = ({
  name,
  label,
  lang,
  placeholder,
  formik,
  startAdornment,
  endAdornment,
  type,
  required,
  tooltip,
  loading = false,
  labelIcon,
  ...rest
}: CustomTextFieldProps) => {
  const theme = useTheme();
  const langText = lang ? (lang === "th" ? " (ภาษาไทย)" : " (ภาษาอังกฤษ)") : "";
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClearSearch = () => {
    if (formik) {
      formik.setFieldValue(name, "");
    } else if (rest.onChange) {
      rest.onChange({ target: { name, value: "" } } as any);
    }
  };

  if (loading) {
    const skeleton = (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={44}
        sx={{
          borderRadius: 1,
          "&::after": {
            animationDuration: "2s",
          },
        }}
      />
    );

    return (
      <>
        {label && (
          <BaseLabel htmlFor={name}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {labelIcon ? <span style={{ display: "inline-flex", alignItems: "center" }}>{labelIcon}</span> : null}
              <span>
                {label}
                {langText}
              </span>
              {required && <span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span>}
              {tooltip && (
                <Tooltip title={tooltip} placement="bottom-start">
                  <span style={{ display: "inline-flex", marginLeft: 8, cursor: "pointer" }} aria-label="info">
                    <IconInfoCircle width={16} />
                  </span>
                </Tooltip>
              )}
            </span>
          </BaseLabel>
        )}
        {skeleton}
      </>
    );
  }

  let helperText = null;
  if (formik?.touched[name] && formik?.errors[name]) {
    if (typeof formik.errors[name] === "string" && formik.errors[name].includes("\n")) {
      helperText = formik.errors[name].split("\n").map((msg: string, idx: number) => (
        <span key={idx} style={{ display: "block" }}>
          {msg}
        </span>
      ));
    } else {
      helperText = formik.errors[name];
    }
  }

  const getStartAdornment = () => {
    if (startAdornment) return startAdornment;

    if (type === "search") {
      return (
        <InputAdornment position="start">
          <IconSearch size={20} />
        </InputAdornment>
      );
    }

    return null;
  };

  const getEndAdornment = () => {
    if (endAdornment) return endAdornment;

    if (type === "password") {
      return (
        <InputAdornment position="end">
          <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
            {showPassword ? <IconEyeOff width={20} /> : <IconEye width={20} />}
          </IconButton>
        </InputAdornment>
      );
    }

    if (type === "search") {
      const currentValue = formik?.values[name] || rest.value || "";
      if (currentValue) {
        return (
          <InputAdornment position="end">
            <IconButton aria-label="clear search" onClick={handleClearSearch} edge="end" size="small">
              <IconX size={16} />
            </IconButton>
          </InputAdornment>
        );
      }
    }

    return null;
  };

  const textField = (
    <StyledTextField
      fullWidth
      variant="outlined"
      id={name}
      name={name}
      type={type === "password" ? (showPassword ? "text" : "password") : type}
      value={formik?.values[name]}
      onChange={formik?.handleChange}
      onBlur={formik?.handleBlur}
      placeholder={placeholder}
      error={formik?.touched[name] && Boolean(formik.errors[name])}
      helperText={helperText}
      autoComplete={type === "password" ? "new-password" : undefined}
      slotProps={{
        input: {
          startAdornment: getStartAdornment(),
          endAdornment: getEndAdornment(),
          ...(rest.slotProps?.input || {}),
        },
      }}
      {...rest}
    />
  );

  return (
    <>
      {label && (
        <BaseLabel htmlFor={name}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {labelIcon ? <span style={{ display: "inline-flex", alignItems: "center" }}>{labelIcon}</span> : null}
            <span>
              {label}
              {langText}
            </span>
            {required && <span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span>}
            {tooltip && (
              <Tooltip title={tooltip} placement="top">
                  <IconInfoCircle width={16} color={theme.palette.info.main} cursor={'pointer'}/>
              </Tooltip>
            )}
          </span>
        </BaseLabel>
      )}
      {textField}
    </>
  );
};

export default BaseTextField;
