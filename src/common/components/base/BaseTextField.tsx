"use client";

import React from "react";
import { TextField, InputAdornment, TextFieldProps, Skeleton, IconButton } from "@mui/material";
import { IconEye, IconEyeOff, IconSearch, IconX } from "@tabler/icons-react";
import { IsLanguage } from "@/common/contexts/ProfileContext/interfaces/interface";
import { ReactNode, useState, useEffect } from "react";
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
  // show formatted display with thousands separators when NOT focused
  thousandSeparator?: boolean;
  // ถ้า true จะตัด/ป้องกันเลข 0 นำหน้า เช่น "09124" -> "9124"
  noLeadingZero?: boolean;
  // ถ้า true จะอนุญาตทศนิยม เช่น "0.5"
  allowFloat?: boolean;
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
    thousandSeparator = false,
    noLeadingZero = false,
    allowFloat = false,
    ...rest
  } = props;
  const theme = useTheme();

  // sanitize function: ลบ 0 นำหน้า บนส่วน integer แต่ยังคงอนุญาต "0", "0.xxx", "-" intermediates
  const sanitizeLeadingZeros = (val: string) => {
    if (val === undefined || val === null) return val;
    const s = String(val);
    // keep intermediate editing states
    if (s === "-" || s === "." || s === "-.") return s;
    const neg = s.startsWith("-");
    let body = neg ? s.slice(1) : s;
    const parts = body.split(".");
    let intPart = parts[0].replace(/^0+(?=\d)/, "");
    if (intPart === "") intPart = "0";
    const fracPart = parts[1];
    const res = intPart + (typeof fracPart !== "undefined" ? `.${fracPart}` : "");
    return (neg ? "-" : "") + res;
  };

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

    // keep numeric hint for legacy `type="number"` only
    if (type === "number") {
      if (allowFloat) {
        inputProps.inputMode = "decimal";
        // allow decimals via pattern
        inputProps.pattern = "\\d*(\\.\\d+)?";
      } else {
        inputProps.inputMode = "numeric";
        inputProps.pattern = "\\d*";
      }
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
    const rawVal = formik ? getIn(formik.values, name) : e.target?.value ?? "";
    const clamped = clampNumberValue(rawVal);
    if (formik && clamped !== rawVal) {
      formik.setFieldValue(name, clamped);
    }
    if (typeof rest.onBlur === "function") rest.onBlur(e);
    if (typeof formik?.handleBlur === "function") formik.handleBlur(e);
  };

  // prevent invalid chars for legacy `type="number"` and sanitize paste
  const userSlotInput = (rest.slotProps && (rest.slotProps as any).input) || {};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // legacy numeric enforcement only when type === "number"
    if (type !== "number") {
      if (userSlotInput.onKeyDown) userSlotInput.onKeyDown(e);
      return;
    }

    const allowedControlKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab", "Home", "End"];
    if (allowedControlKeys.includes(e.key)) {
      if (userSlotInput.onKeyDown) userSlotInput.onKeyDown(e);
      return;
    }
    // allow digits, and dot when allowFloat=true (only one dot)
    const cur = (e.target as HTMLInputElement).value ?? "";
    if (allowFloat) {
      if (e.key === ".") {
        // prevent second dot
        if (cur.includes(".")) {
          e.preventDefault();
        }
        if (userSlotInput.onKeyDown) userSlotInput.onKeyDown(e);
        return;
      }
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    } else {
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
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
    // preserve dot when allowFloat
    let digits = allowFloat ? text.replace(/[^0-9.]+/g, "") : text.replace(/\D+/g, "");
    // if multiple dots, keep first only
    if (allowFloat) digits = digits.replace(/\.(?=.*\.)/g, "");
    if (noLeadingZero) digits = sanitizeLeadingZeros(digits);
    e.preventDefault();
    if (formik) formik.setFieldValue(name, digits);
    else if (rest.onChange) rest.onChange({ target: { name, value: digits } } as any);
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
  const controlledValueRaw = formik ? getIn(formik.values, name) ?? "" : (rest.value as any);

  // focus state to toggle formatted display
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // if parent changes value while focused, keep showing raw; otherwise when not focused show formatted
    if (!isFocused && thousandSeparator) {
      // no-op; re-render will show formatted version
    }
  }, [controlledValueRaw, isFocused, thousandSeparator]);

  // helper to format with commas without altering underlying value
  const formatWithCommas = (val: any) => {
    if (val === null || val === undefined) return "";
    const s = String(val);
    if (s === "") return "";
    // preserve decimal part if any
    const neg = s.startsWith("-");
    const body = neg ? s.slice(1) : s;
    const parts = body.split(".");
    const intPart = parts[0].replace(/,/g, "");
    const fracPart = parts[1];
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (neg ? "-" : "") + formattedInt + (typeof fracPart !== "undefined" ? `.${fracPart}` : "");
  };

  const displayValue = thousandSeparator && !isFocused ? formatWithCommas(controlledValueRaw) : (controlledValueRaw ?? "");

  // choose effective input type to hint browser (avoid native number spinners)
  const effectiveType = type === "password" ? (showPassword ? "text" : "password") : type ?? "text";

  const textField = (
    <StyledTextField
      fullWidth
      variant="outlined"
      id={name}
      name={name}
      type={effectiveType}
      {...(shouldControl ? { value: displayValue } : {})}
      onChange={(e: any) => {
        if (readOnly) return;
        // remove visual commas
        let rawInput = String(e.target.value).replace(/,/g, "");
        // decide whether underlying value should be numeric
        const shouldBeNumber = type === "number" || typeof controlledValueRaw === "number";
        let emitValue: any = rawInput;
        if (shouldBeNumber) {
          // allow decimal and negative, then convert to number when possible
          let cleaned = rawInput === "" ? "" : rawInput.replace(/[^0-9.\-]/g, "");
          if (noLeadingZero) cleaned = sanitizeLeadingZeros(cleaned);
          // keep intermediate editing states (".", "-.", "-") as string so user can type decimal/negative
          if (cleaned === "" || cleaned === "-" || cleaned === "." || cleaned === "-.") {
            emitValue = cleaned;
          } else {
            const n = Number(cleaned);
            emitValue = Number.isFinite(n) ? n : cleaned;
          }
        }
        if (formik && typeof formik.setFieldValue === "function") {
          formik.setFieldValue(name, emitValue);
        } else if (rest.onChange) {
          rest.onChange({ target: { name, value: emitValue } } as any);
        }
      }}
      onFocus={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsFocused(true);
        if (typeof rest.onFocus === "function") rest.onFocus(e);
      }}
      onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsFocused(false);
        handleBlurWithClamp(e);
      }}
      placeholder={placeholder}
      error={Boolean(fieldTouched && fieldError)}
      helperText={fieldTouched && fieldError ? fieldError : helperText}
      autoComplete={type === "password" ? "new-password" : undefined}
      InputProps={mergedInputProps}
      slotProps={{
        input: {
          // keep adornments and user-provided slot props
          startAdornment: getStartAdornment(),
          endAdornment: getEndAdornment(),
          ...(userSlotInput || {}),
          onKeyDown: (e: any) => {
            handleKeyDown(e);
            if (userSlotInput.onKeyDown) userSlotInput.onKeyDown(e);
          },
          onPaste: (e: any) => {
            const pasted = e.clipboardData?.getData?.("text") ?? "";
            const cleaned = pasted.replace(/,/g, "");
            const shouldBeNumber = type === "number" || typeof controlledValueRaw === "number";
            e.preventDefault();
            if (shouldBeNumber) {
              // preserve dot when allowFloat; keep intermediate states
              let cleanedNum = cleaned === "" ? "" : (allowFloat ? cleaned.replace(/[^0-9.\-]/g, "") : cleaned.replace(/[^0-9.\-]/g, ""));
              if (allowFloat) cleanedNum = cleanedNum.replace(/\.(?=.*\.)/g, "");
              let asValue: any = cleanedNum;
              if (!(cleanedNum === "" || cleanedNum === "-" || cleanedNum === "." || cleanedNum === "-.")) {
                const n = Number(cleanedNum);
                asValue = Number.isFinite(n) ? n : cleanedNum;
              }
              if (formik) formik.setFieldValue(name, asValue);
              else if (rest.onChange) rest.onChange({ target: { name, value: asValue } } as any);
            } else {
              if (formik) formik.setFieldValue(name, cleaned);
              else if (rest.onChange) rest.onChange({ target: { name, value: cleaned } } as any);
            }
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