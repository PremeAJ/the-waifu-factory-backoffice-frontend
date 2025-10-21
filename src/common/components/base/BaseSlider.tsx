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

  // โหมดการแสดงผลค่า
  mode?: "percent" | "value"; // percent จะเติม % ให้
  unit?: string; // ใช้กับ mode="value" เช่น "฿", "kg", "pcs"
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
  mode = "percent",
  unit,
  valueLabelDisplay = "auto",
  showInput = true,
  disabled,
  sx,
  onChange,
}) => {
  const value: number = Number(formik?.values?.[name] ?? 0);

  const formatValue = (v: number) => {
    if (mode === "percent") return `${v}%`;
    if (unit) return `${v}${unit}`;
    return String(v);
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
      formik?.setFieldValue?.(name, raw);
    }
  };

  const hasError = Boolean(formik?.touched?.[name] && formik?.errors?.[name]);
  const helper = hasError ? formik?.errors?.[name] : undefined;

  return (
    <FormControl fullWidth error={hasError} sx={sx} disabled={disabled}>
      {label && <BaseLabel required={required} tooltip={tooltip}>{label}</BaseLabel>}

      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ flexGrow: 1, px: 1 }}>
          <Slider
            value={value}
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
          <Box minWidth={110} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            />
            {(mode === "percent" || unit) && (
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                {mode === "percent" ? "%" : unit}
              </Typography>
            )}
          </Box>
        )}
      </Stack>

      {helper && <FormHelperText>{helper}</FormHelperText>}
    </FormControl>
  );
};

export default BaseSlider;