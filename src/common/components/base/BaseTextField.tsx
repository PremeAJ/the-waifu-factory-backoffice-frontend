"use client";

import React from "react";
import { TextField, InputAdornment, TextFieldProps, Skeleton, Tooltip, IconButton } from "@mui/material";
import { IconEye, IconEyeOff, IconSearch, IconX, IconInfoCircle } from "@tabler/icons-react";
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
  suffix?: React.ReactNode; // ส่วนต่อท้าย เช่น %, ฿ ฯลฯ
  readOnly?: boolean;
  /**
   * keyboardType:
   * - "number": numeric keypad (0-9) — only digits allowed
   * - "decimal": numeric keypad with dot — digits and one dot allowed
   * - "email": email-optimized keyboard (allows @ and .)
   */
  keyboardType?: "number" | "decimal" | "email";
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
    keyboardType,
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
    // cast to any so we can set inputMode / pattern etc. without TS complaining
    const inputProps = { ...(base.inputProps || {}), readOnly: readOnly ?? base.inputProps?.readOnly } as any;

    // set mobile keyboard inputMode and pattern based on keyboardType
    if (keyboardType === "number") {
      inputProps.inputMode = "numeric";
      inputProps.pattern = "\\d*";
    } else if (keyboardType === "decimal") {
      // decimal keypad on many platforms
      inputProps.inputMode = "decimal";
      inputProps.pattern = "\\d*(\\.\\d*)?";
    } else if (keyboardType === "email") {
      inputProps.inputMode = "email";
      // do not force pattern for email
    }

    return {
      ...base,
      endAdornment: endAd ?? base.endAdornment,
      readOnly: readOnly ?? base.readOnly,
      inputProps,
    };
  }, [InputProps, suffix, readOnly, keyboardType]);

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

  // --- helper: nested get/set for paths like "productOptions[0].price"
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
    // get current raw from formik or from event
    const rawVal = formik ? getIn(formik.values, name) : e.target?.value ?? "";
    const clamped = clampNumberValue(rawVal);
    if (formik && clamped !== rawVal) {
      formik.setFieldValue(name, clamped);
    }
    if (typeof rest.onBlur === "function") rest.onBlur(e);
    if (typeof formik?.handleBlur === "function") formik.handleBlur(e);
  };

  // prevent invalid chars for numbers and sanitize paste
  const userSlotInput = (rest.slotProps && (rest.slotProps as any).input) || {};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // prioritize keyboardType rules; fallback to legacy numeric behavior when type === "number"
    const mode = keyboardType ?? (type === "number" ? "number" : undefined);

    if (!mode) {
      if (userSlotInput.onKeyDown) userSlotInput.onKeyDown(e);
      return;
    }

    const allowedControlKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab", "Home", "End"];
    if (allowedControlKeys.includes(e.key)) {
      if (userSlotInput.onKeyDown) userSlotInput.onKeyDown(e);
      return;
    }

    if (mode === "number") {
      // allow only digits
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    } else if (mode === "decimal") {
      // allow digits and one dot
      const input = e.currentTarget as HTMLInputElement;
      const hasDot = input.value.includes(".");
      if (!/^\d$/.test(e.key) && e.key !== ".") {
        e.preventDefault();
      } else if (e.key === "." && hasDot) {
        e.preventDefault();
      }
    } else if (mode === "email") {
      // allow most printable chars but disallow spaces
      if (e.key === " ") {
        e.preventDefault();
      }
      // allow typical email chars, don't be overly restrictive here
    }

    if (userSlotInput.onKeyDown) userSlotInput.onKeyDown(e);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const mode = keyboardType ?? (type === "number" ? "number" : undefined);
    if (!mode) {
      if (userSlotInput.onPaste) userSlotInput.onPaste(e);
      return;
    }
    const text = e.clipboardData.getData("text");
    if (!text) {
      e.preventDefault();
      return;
    }

    if (mode === "number") {
      const digits = text.replace(/\D+/g, "");
      e.preventDefault();
      if (formik) formik.setFieldValue(name, digits);
      else if (rest.onChange) rest.onChange({ target: { name, value: digits } } as any);
    } else if (mode === "decimal") {
      // keep only digits and first dot
      const cleaned = text.replace(/[^0-9.]/g, "");
      const parts = cleaned.split(".");
      const normalized = parts.length <= 1 ? parts[0] : parts.shift() + "." + parts.join("");
      e.preventDefault();
      if (formik) formik.setFieldValue(name, normalized);
      else if (rest.onChange) rest.onChange({ target: { name, value: normalized } } as any);
    } else {
      // email: accept paste but trim spaces
      const trimmed = text.trim();
      e.preventDefault();
      if (formik) formik.setFieldValue(name, trimmed);
      else if (rest.onChange) rest.onChange({ target: { name, value: trimmed } } as any);
    }

    if (userSlotInput.onPaste) userSlotInput.onPaste(e);
  };

  // --- helper text / error using nested path
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

  // decide controlled/uncontrolled using nested get
  const shouldControl = Boolean(formik) || rest.value !== undefined;
  const controlledValue = formik ? getIn(formik.values, name) ?? "" : (rest.value as any);

  // choose effective input type to hint browser (avoid native number spinners)
  const effectiveType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : keyboardType === "number"
      ? "tel"
      : keyboardType === "decimal"
      ? "text"
      : type ?? "text";

  const textField = (
    <StyledTextField
      fullWidth
      variant="outlined"
      id={name}
      name={name}
      type={effectiveType}
      {...(shouldControl ? { value: controlledValue } : {})}
      onChange={(e: any) => {
        if (readOnly) return;
        if (formik && typeof formik.setFieldValue === "function") {
          const val =
            keyboardType === "number"
              ? (e.target.value === "" ? "" : String(e.target.value).replace(/\D+/g, ""))
              : keyboardType === "decimal"
              ? (e.target.value === "" ? "" : String(e.target.value).replace(/[^0-9.]/g, ""))
              : type === "number"
              ? (e.target.value === "" ? "" : Number(e.target.value))
              : e.target.value;
          formik.setFieldValue(name, val);
        } else if (rest.onChange) {
          rest.onChange(e);
        } else {
        }
      }}
      onBlur={handleBlurWithClamp}
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
          onPaste: (e: any) => {
            handlePaste(e);
            if (userSlotInput.onPaste) userSlotInput.onPaste(e);
          },
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
