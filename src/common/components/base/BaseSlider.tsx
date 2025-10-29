"use client";

import React from "react";
import { Box, FormControl, FormHelperText, Slider, Stack, Typography } from "@mui/material";
import BaseLabel from "./BaseLabel";
import BaseTextField from "./BaseTextField";

type ValueLabelDisplay = "on" | "auto" | "off";

export interface BaseSliderProps {
  name: string;
  formik?: any;
  label?: string;
  required?: boolean;
  tooltip?: string;

  min?: number;
  max?: number;
  step?: number;

  // ใช้แสดงข้างช่องกรอกตัวเลข / label (เช่น "%" "฿" "kg")
  suffix?: string;
  valueLabelDisplay?: ValueLabelDisplay;

  showInput?: boolean; // แสดงช่องกรอกตัวเลขข้างสไลเดอร์
  disabled?: boolean;
  sx?: any;

  onChange?: (value: number) => void; // ถ้าต้องการ hook ภายนอก
}

const BaseSlider: React.FC<BaseSliderProps> = ({
  name,
  formik,
  label,
  required,
  tooltip,
  min = 0,
  max = 100,
  step = 1,
  valueLabelDisplay = "auto",
  showInput = true,
  disabled,
  sx,
  suffix,
  onChange,
}) => {

  // helper getIn for nested path support (bracket / dot)
  const getIn = (obj: any, path: string) => {
    if (!obj || !path) return undefined;
    const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
    return parts.reduce((acc: any, key: string) => (acc != null ? acc[key] : undefined), obj);
  };

  // read numeric value from formik (support nested name)
  const rawVal = formik ? getIn(formik.values, name) : undefined;
  const value: number = rawVal === "" || rawVal == null ? 0 : Number(rawVal);

  const formatValue = (v: number) => {
    // Used for Slider label display only. Underlying value remains numeric.
    return suffix ? `${v}${suffix}` : String(v);
  };

  const handleChange = (_: Event, newValue: number | number[]) => {
    const next = Array.isArray(newValue) ? Number(newValue[0]) : Number(newValue);
    formik?.setFieldValue?.(name, next);
    onChange?.(next);
  };

  const handleInput = (e: any) => {
    const raw = e?.target?.value ?? e;
    const num = Number(raw);
    if (!Number.isNaN(num)) {
      const bounded = Math.min(max, Math.max(min, num));
      formik?.setFieldValue?.(name, bounded);
      onChange?.(bounded);
    } else {
      const fallback = Math.max(min, 0);
      formik?.setFieldValue?.(name, fallback);
      onChange?.(fallback);
    }
  };

  // read error/touched using nested getIn
  const hasError = Boolean(getIn(formik?.touched, name) && getIn(formik?.errors, name));
  const helper = hasError ? getIn(formik?.errors, name) : undefined;

  return (
    <FormControl fullWidth error={hasError} sx={sx} disabled={disabled}>
      {label && <BaseLabel required={required} tooltip={tooltip}>{label}</BaseLabel>}

      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ flexGrow: 1, px: 1 }}>
          <Slider
            value={Number.isFinite(value) ? value : 0}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
            valueLabelDisplay={valueLabelDisplay}
            valueLabelFormat={formatValue}
            aria-label={label || name}
          />
        </Box>

        {showInput && (
          <Box minWidth={50} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BaseTextField
              name={name}
              formik={formik}
              value={value}
              onChange={handleInput as any}
              type="number"
              size="small"
              inputProps={{ min, max, step }}
              label=""
              placeholder=""
              suffix={suffix}
              disabled
            />
          </Box>
        )}
      </Stack>

      {helper && <FormHelperText>{helper}</FormHelperText>}
    </FormControl>
  );
};

export default BaseSlider;