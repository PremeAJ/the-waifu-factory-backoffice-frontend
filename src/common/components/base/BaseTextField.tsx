"use client";

import React from "react";
import { TextField, InputAdornment, TextFieldProps, Skeleton, IconButton } from "@mui/material";
import { IconEye, IconEyeOff, IconSearch, IconX } from "@tabler/icons-react";
import { IsLanguage } from "@/common/contexts/ProfileContext/interfaces/interface";
import { ReactNode, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
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
  suffix?: React.ReactNode;
  readOnly?: boolean;
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

const BaseTextField: React.FC<CustomTextFieldProps> = (props) => {
  const {
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
    InputProps,
    suffix,
    readOnly,
    ...rest
  } = props;
  const theme = useTheme();

  const langText = React.useMemo(() => {
    if (!label || !lang) return null;
    return lang === "th" ? <span style={{ marginLeft: 6, color: "gray" }}>(TH)</span> : <span style={{ marginLeft: 6, color: "gray" }}>(EN)</span>;
  }, [label, lang]);

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

  const mergedInputProps = React.useMemo(() => {
    const endAd = suffix ? <InputAdornment position="end">{suffix}</InputAdornment> : undefined;
    const base = { ...(InputProps || {}) };
    const inputProps = { ...(base.inputProps || {}), readOnly: readOnly ?? base.inputProps?.readOnly } as any;

    if (type === "number") {
      inputProps.inputMode = "numeric";
      inputProps.pattern = "\\d*";
    }

    return {
      ...base,
      endAdornment: endAd ?? base.endAdornment,
      readOnly: readOnly ?? base.readOnly,
      inputProps,
    };
  }, [InputProps, suffix, readOnly, type]);

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
          <BaseLabel htmlFor={name} tooltip={tooltip} required={required}>
            {label}
            {langText}
          </BaseLabel>
        )}
        {skeleton}
      </>
    );
  }

  const getIn = (obj: any, path: string) => {
    if (!obj || !path) return undefined;
    const parts = path
      .replace(/\[(\d+)\]/g, ".$1")
      .split(".")
      .filter(Boolean);
    return parts.reduce((acc: any, key: string) => (acc != null ? acc[key] : undefined), obj);
  };

  const clampNumberValue = (raw: any) => {
    if (type !== "number") return raw;
    const min = (rest.inputProps && (rest.inputProps as any).min) ?? (InputProps && (InputProps as any).min);
    const max = (rest.inputProps && (rest.inputProps as any).max) ?? (InputProps && (InputProps as any).max);
    const num = raw === "" || raw === null ? "" : Number(raw);
    if (num === "" || Number.isNaN(num)) return raw;
    if (min !== undefined && num < Number(min)) return Number(min);
    if (max !== undefined && num > Number(max)) return Number(max);
    return num;
  };

  const handleBlurWithClamp = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rawVal = formik ? getIn(formik.values, name) : e.target?.value ?? "";
    const clamped = clampNumberValue(rawVal);
    if (formik && clamped !== rawVal) {
      formik.setFieldValue(name, clamped);
    }
    if (typeof rest.onBlur === "function") rest.onBlur(e);
    if (typeof formik?.handleBlur === "function") formik.handleBlur(e);
  };

  const userSlotInput = (rest.slotProps && (rest.slotProps as any).input) || {};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type !== "number") {
      if (userSlotInput.onKeyDown) userSlotInput.onKeyDown(e);
      return;
    }

    const allowedControlKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab", "Home", "End"];
    if (allowedControlKeys.includes(e.key)) {
      if (userSlotInput.onKeyDown) userSlotInput.onKeyDown(e);
      return;
    }

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
    if (userSlotInput.onKeyDown) userSlotInput.onKeyDown(e);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (type !== "number") {
      if (userSlotInput.onPaste) userSlotInput.onPaste(e);
      return;
    }
    const text = e.clipboardData.getData("text");
    if (!text) {
      e.preventDefault();
      return;
    }
    const digits = text.replace(/\D+/g, "");
    e.preventDefault();
    if (formik) formik.setFieldValue(name, digits);
    else if (rest.onChange) rest.onChange({ target: { name, value: digits } } as any);
    if (userSlotInput.onPaste) userSlotInput.onPaste(e);
  };

  let helperText: any = null;
  const fieldError = formik ? getIn(formik.errors, name) : undefined;
  const fieldTouched = formik ? getIn(formik.touched, name) : undefined;
  if (fieldTouched && fieldError) {
    if (typeof fieldError === "string" && fieldError.includes("\n")) {
      helperText = fieldError.split("\n").map((msg: string, idx: number) => (
        <span key={idx} style={{ display: "block" }}>
          {msg}
        </span>
      ));
    } else {
      helperText = fieldError;
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
    if (suffix) return <InputAdornment position="end">{suffix}</InputAdornment>;
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
      const currentValue = formik ? getIn(formik.values, name) ?? "" : rest.value ?? "";
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

  const shouldControl = Boolean(formik) || rest.value !== undefined;
  const controlledValueRaw = formik ? getIn(formik.values, name) ?? "" : (rest.value as any);
  const effectiveType = type === "password" ? (showPassword ? "text" : "password") : type ?? "text";

  const textField = (
    <StyledTextField
      fullWidth
      variant="outlined"
      id={name}
      name={name}
      type={effectiveType}
      {...(shouldControl ? { value: controlledValueRaw } : {})}
      onChange={(e: any) => {
        if (readOnly) return;
        const rawInput = e.target.value;

        if (formik && typeof formik.setFieldValue === "function") {
          formik.setFieldValue(name, rawInput);
        } else if (rest.onChange) {
          rest.onChange({ target: { name, value: rawInput } } as any);
        }
      }}
      onFocus={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (typeof rest.onFocus === "function") rest.onFocus(e);
      }}
      onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleBlurWithClamp(e);
      }}
      placeholder={placeholder}
      error={Boolean(fieldTouched && fieldError)}
      helperText={fieldTouched && fieldError ? fieldError : helperText}
      autoComplete={type === "password" ? "new-password" : undefined}
      InputProps={mergedInputProps}
      slotProps={{
        input: {
          startAdornment: getStartAdornment(),
          endAdornment: getEndAdornment(),
          ...(userSlotInput || {}),
          onKeyDown: (e: any) => {
            handleKeyDown(e);
            if (userSlotInput.onKeyDown) userSlotInput.onKeyDown(e);
          },
          onPaste: handlePaste,
        },
      }}
      {...rest}
    />
  );

  return (
    <>
      {label && (
        <BaseLabel htmlFor={name} tooltip={tooltip} required={required}>
          {label}
          {langText}
        </BaseLabel>
      )}
      {textField}
    </>
  );
};

export default BaseTextField;
