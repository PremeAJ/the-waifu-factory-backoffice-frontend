"use client";

import React from "react";
import { TextField, InputAdornment, TextFieldProps, Skeleton, Tooltip, IconButton } from "@mui/material";
import { IconEye, IconEyeOff, IconSearch, IconX, IconInfoCircle } from "@tabler/icons-react";
import { IsLanguage } from "@/common/contexts/ProfileContext/interfaces/interface";
import { ReactNode, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import BaseLabel from "./BaseLabel";
import formatNumber from "@/common/utils/formatNumber";

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
    "&::-ms-reveal": { display: "none" },
    "&::-ms-clear": { display: "none" },
  },
  "& input[type=search]": {
    "&::-webkit-search-cancel-button": { display: "none" },
    "&::-webkit-search-decoration": { display: "none" },
    "&::-ms-clear": { display: "none" },
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

  // *** ย้าย ALL HOOKS ขึ้นมาไว้ที่นี่ก่อน early return ***
  const [showPassword, setShowPassword] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  const langText = React.useMemo(() => {
    if (!label || !lang) return null;
    return lang === "th" ? <span style={{ marginLeft: 6, color: "gray" }}>(TH)</span> : <span style={{ marginLeft: 6, color: "gray" }}>(EN)</span>;
  }, [label, lang]);

  const mergedInputProps = React.useMemo(() => {
    const endAd = suffix ? <InputAdornment position="end">{suffix}</InputAdornment> : undefined;
    const base = { ...(InputProps || {}) };
    const inputProps = { ...(base.inputProps || {}), readOnly: readOnly ?? base.inputProps?.readOnly };
    return {
      ...base,
      endAdornment: endAd ?? base.endAdornment,
      readOnly: readOnly ?? base.readOnly,
      inputProps,
    };
  }, [InputProps, suffix, readOnly]);

  // sync display value when not focused
  React.useEffect(() => {
    if (type === "number" && !isFocused) {
      const getIn = (obj: any, path: string) => {
        if (!obj || !path) return undefined;
        const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
        return parts.reduce((acc: any, key: string) => (acc != null ? acc[key] : undefined), obj);
      };
      const rawVal = formik ? getIn(formik.values, name) : rest.value;
      if (rawVal === "" || rawVal === null || rawVal === undefined) {
        setDisplayValue("");
      } else {
        const num = Number(rawVal);
        if (!Number.isNaN(num)) {
          setDisplayValue(formatNumber(num, 2));
        } else {
          setDisplayValue(String(rawVal));
        }
      }
    }
  }, [type, isFocused, formik, name, rest.value]);

  // *** ตอนนี้ใส่ early return ได้แล้ว ***
  if (loading) {
    return (
      <>
        {label && (
          <BaseLabel htmlFor={name} tooltip={tooltip} required={required}>
            {label}
            {langText}
          </BaseLabel>
        )}
        <Skeleton variant="rectangular" width="100%" height={44} sx={{ borderRadius: 1, "&::after": { animationDuration: "2s" } }} />
      </>
    );
  }

  // --- helper functions ---
  const getIn = (obj: any, path: string) => {
    if (!obj || !path) return undefined;
    const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
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

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

  const handleClearSearch = () => {
    if (formik) {
      formik.setFieldValue(name, "");
    } else if (rest.onChange) {
      rest.onChange({ target: { name, value: "" } } as any);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(true);
    if (typeof rest.onFocus === "function") rest.onFocus(e);
  };

  const handleBlurWithClamp = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    const rawVal = formik ? getIn(formik.values, name) : e.target?.value ?? "";
    const clamped = clampNumberValue(rawVal);
    if (formik && clamped !== rawVal) {
      formik.setFieldValue(name, clamped);
    }
    if (typeof rest.onBlur === "function") rest.onBlur(e);
    if (typeof formik?.handleBlur === "function") formik.handleBlur(e);
  };

  const userSlotInput = (rest.slotProps && (rest.slotProps as any).input) || {};

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type !== "number") return;
    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
  };

  const handlePasteNumber = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (type !== "number") return;
    const text = e.clipboardData.getData("text");
    if (!text) {
      e.preventDefault();
      return;
    }
    const num = Number(text);
    if (Number.isNaN(num)) {
      e.preventDefault();
      return;
    }
    const min = (rest.inputProps && (rest.inputProps as any).min) ?? (InputProps && (InputProps as any).min);
    const max = (rest.inputProps && (rest.inputProps as any).max) ?? (InputProps && (InputProps as any).max);
    let clamped = num;
    if (min !== undefined && clamped < Number(min)) clamped = Number(min);
    if (max !== undefined && clamped > Number(max)) clamped = Number(max);
    e.preventDefault();
    if (formik) formik.setFieldValue(name, clamped);
    else if (rest.onChange) rest.onChange({ target: { name, value: clamped } } as any);
  };

  const fieldError = formik ? getIn(formik.errors, name) : undefined;
  const fieldTouched = formik ? getIn(formik.touched, name) : undefined;
  let helperText: any = rest.helperText || null;
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
  const rawValue = formik ? getIn(formik.values, name) ?? "" : (rest.value as any);
  const controlledValue = type === "number" && !isFocused ? displayValue : rawValue;

  const textField = (
    <StyledTextField
      fullWidth
      variant="outlined"
      id={name}
      name={name}
      type={type === "password" ? (showPassword ? "text" : "password") : type === "number" && !isFocused ? "text" : type}
      {...(shouldControl ? { value: controlledValue } : {})}
      onChange={(e: any) => {
        if (readOnly) return;
        if (formik && typeof formik.setFieldValue === "function") {
          const val = type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value;
          formik.setFieldValue(name, val);
        } else if (rest.onChange) {
          rest.onChange(e);
        }
      }}
      onFocus={handleFocus}
      onBlur={handleBlurWithClamp}
      placeholder={placeholder}
      error={Boolean(fieldTouched && fieldError)}
      helperText={helperText}
      autoComplete={type === "password" ? "new-password" : undefined}
      InputProps={mergedInputProps}
      slotProps={{
        input: {
          startAdornment: getStartAdornment(),
          endAdornment: getEndAdornment(),
          ...(userSlotInput || {}),
          onKeyDown: (e: any) => {
            handleNumberKeyDown(e);
            if (userSlotInput.onKeyDown) userSlotInput.onKeyDown(e);
          },
          onPaste: (e: any) => {
            handlePasteNumber(e);
            if (userSlotInput.onPaste) userSlotInput.onPaste(e);
          },
        },
      }}
      inputProps={{
        ...(rest.inputProps || {}),
        ...(type === "number" ? { inputMode: "decimal" } : {}),
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
