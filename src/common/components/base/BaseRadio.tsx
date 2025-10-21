"use client";
import React from "react";
import { Box, ButtonBase, FormControl, FormControlLabel, FormHelperText, RadioGroup, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import BaseLabel from "./BaseLabel";
import CustomRadio from "@/components/forms/theme-elements/CustomRadio";

export type BaseRadioOption = {
  value: string | number;
  label: React.ReactNode;
};

type Props = {
  name: string;
  label?: string;
  required?: boolean;
  tooltip?: string;
  formik?: any;
  options: BaseRadioOption[];
  row?: boolean;
  // แสดงเป็นการ์ดคลิกได้ (สไตล์เดียวกับของเดิมใน Pricing)
  variant?: "default" | "card";
  mdPerRow?: 3; // ใช้กับ variant="card" คุมจำนวนคอลัมน์บนจอ md
  sx?: any;
};

const BaseRadio: React.FC<Props> = ({ name, label, required, tooltip, formik, options, row = true, variant = "default", mdPerRow = 3, sx }) => {
  const theme = useTheme();
  const value = formik?.values?.[name];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | string | number) => {
    const next = typeof event === "string" || typeof event === "number" ? event : event.target.value;
    formik?.setFieldValue?.(name, next);
  };

  const hasError = Boolean(formik?.touched?.[name] && formik?.errors?.[name]);
  const helper = hasError ? formik?.errors?.[name] : undefined;

  const cardSx = (active: boolean) => ({
    px: 2,
    py: 1,
    flexGrow: 1,
    textAlign: "center" as const,
    border: `1px dashed ${active ? theme.palette.primary.main : theme.palette.divider}`,
    bgcolor: active ? theme.palette.action.selected : "transparent",
    borderRadius: 1,
    height: "100%",
  });

  if (variant === "card") {
    const md = Math.max(1, Math.min(12, Math.floor(12 / mdPerRow)));
    return (
      <FormControl component="fieldset" error={hasError} sx={{ width: "100%", ...sx }}>
        {label && (
          <BaseLabel required={required} tooltip={tooltip}>
            {label}
          </BaseLabel>
        )}
        <RadioGroup row={row} name={name} value={value} onChange={handleChange} sx={{ width: "100%" }}>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            {options.map((opt) => (
              <Grid key={String(opt.value)} size={{ xs: 12, md: md }} sx={{ display: "flex" }}>
                <ButtonBase onClick={() => handleChange(opt.value)} sx={{ width: "100%", height: "100%" }}>
                  <Box sx={cardSx(value === opt.value)}>
                    <FormControlLabel
                      value={opt.value}
                      control={<CustomRadio />}
                      label={<Typography>{opt.label}</Typography>}
                      sx={{ width: "100%", justifyContent: "center", pointerEvents: "none" }}
                    />
                  </Box>
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
        {helper && <FormHelperText>{helper}</FormHelperText>}
      </FormControl>
    );
  }

  // default (แนว RadioGroup ปกติ)
  return (
    <FormControl component="fieldset" error={hasError} sx={{ width: "100%", ...sx }}>
      {label && (
        <BaseLabel required={required} tooltip={tooltip}>
          {label}
        </BaseLabel>
      )}
      <RadioGroup row={row} name={name} value={value} onChange={handleChange}>
        {options.map((opt) => (
          <FormControlLabel key={String(opt.value)} value={opt.value} control={<CustomRadio />} label={opt.label} />
        ))}
      </RadioGroup>
      {helper && <FormHelperText>{helper}</FormHelperText>}
    </FormControl>
  );
};

export default BaseRadio;
