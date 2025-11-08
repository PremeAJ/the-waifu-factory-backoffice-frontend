"use client";

import React, { useState, useMemo } from "react";
import { TextFieldProps } from "@mui/material";
import { formatNumber, removeCommas } from "@/common/utils/formatNumber";
import { IsLanguage } from "@/common/contexts/ProfileContext/interfaces/interface";
import { ReactNode } from "react";
import BaseTextField from "./BaseTextField";

interface BaseNumberFieldProps extends Omit<TextFieldProps, "name" | "type" | "onChange" | "onBlur"> {
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
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  allowNegative?: boolean;
  allowDecimal?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const BaseNumberField: React.FC<BaseNumberFieldProps> = (props) => {
  const {
    name,
    formik,
    maximumFractionDigits = 2,
    minimumFractionDigits = 0,
    allowNegative = false,
    allowDecimal = true,
    onChange,
    onBlur,
    value: externalValue,
    placeholder,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  const getIn = (obj: any, path: string) => {
    if (!obj || !path) return undefined;
    const parts = path
      .replace(/\[(\d+)\]/g, ".$1")
      .split(".")
      .filter(Boolean);
    return parts.reduce((acc: any, key: string) => (acc != null ? acc[key] : undefined), obj);
  };

  const rawValue = formik ? getIn(formik.values, name) ?? "" : externalValue ?? "";

  // สร้าง placeholder อัตโนมัติ
  const defaultPlaceholder = useMemo(() => {
    if (placeholder) return placeholder;

    if (allowDecimal && maximumFractionDigits > 0) {
      return "0." + "0".repeat(maximumFractionDigits);
    }
    return "0";
  }, [placeholder, allowDecimal, maximumFractionDigits]);

  // แสดงค่าที่มีลูกน้ำเมื่อไม่ได้ focus
  const displayValue = isFocused
    ? String(rawValue)
    : formatNumber(rawValue, maximumFractionDigits, minimumFractionDigits);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    // ลบลูกน้ำออก
    input = removeCommas(input);

    // สร้าง pattern ตามเงื่อนไข
    let pattern = allowDecimal ? /[^0-9.]/g : /[^0-9]/g;
    if (allowNegative) {
      pattern = allowDecimal ? /[^0-9.\-]/g : /[^0-9\-]/g;
    }

    // ลบตัวอักษรที่ไม่ใช่ตัวเลข
    let cleaned = input.replace(pattern, "");

    // จำกัดเครื่องหมายลบให้อยู่ตัวแรกเท่านั้น
    if (allowNegative) {
      const hasNegative = cleaned.startsWith("-");
      cleaned = cleaned.replace(/-/g, "");
      if (hasNegative) cleaned = "-" + cleaned;
    }

    // จำกัดจุดทศนิยมให้มีได้แค่จุดเดียว
    if (allowDecimal) {
      const parts = cleaned.split(".");
      if (parts.length > 2) {
        cleaned = parts[0] + "." + parts.slice(1).join("");
      }
    }

    // ถ้าเป็นค่าว่างหรือเครื่องหมายพิเศษ ให้เก็บเป็น string ไว้ก่อน
    if (
      cleaned === "" ||
      cleaned === "-" ||
      cleaned === "." ||
      cleaned === "-." ||
      cleaned.endsWith(".") ||
      (cleaned.includes(".") && cleaned.split(".")[1].length <= maximumFractionDigits && /^[0-9]*\.0*$/.test(cleaned))
    ) {
      if (formik) {
        formik.setFieldValue(name, cleaned);
      }
      if (onChange) {
        onChange({ ...e, target: { ...e.target, name, value: cleaned as any } });
      }
      return;
    }

    // แปลงเป็น number
    const numValue = Number(cleaned);
    const finalValue = Number.isFinite(numValue) ? numValue : cleaned;

    if (formik) {
      formik.setFieldValue(name, finalValue);
    }
    if (onChange) {
      onChange({ ...e, target: { ...e.target, name, value: finalValue as any } });
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (rest.onFocus) {
      rest.onFocus(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);

    // แปลงค่าที่ลงท้ายด้วยจุดหรือเครื่องหมายพิเศษเป็น number
    const currentValue = formik ? getIn(formik.values, name) : externalValue;
    const stringValue = String(currentValue);

    if (stringValue && (stringValue.endsWith(".") || stringValue === "-" || stringValue === "-." || /^[0-9]*\.0*$/.test(stringValue))) {
      const parsed = parseFloat(stringValue);
      const finalValue = isNaN(parsed) ? 0 : parsed;
      if (formik) {
        formik.setFieldValue(name, finalValue);
      }
    }

    if (onBlur) {
      onBlur(e);
    }
    if (formik?.handleBlur) {
      formik.handleBlur(e);
    }
  };

  return (
    <BaseTextField
      {...rest}
      name={name}
      formik={formik}
      value={displayValue}
      placeholder={defaultPlaceholder}
      onChange={handleChange as any}
      onFocus={handleFocus}
      onBlur={handleBlur as any}
      inputProps={{
        inputMode: allowDecimal ? "decimal" : "numeric",
        ...(rest.inputProps || {}),
      }}
    />
  );
};

export default BaseNumberField;
