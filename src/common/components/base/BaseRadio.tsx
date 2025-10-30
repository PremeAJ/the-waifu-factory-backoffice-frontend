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
  variant?: "default" | "card";
  mdPerRow?: 3 | number;
  sx?: any;
  defaultValue?: string | number;
  onClick?: () => void;
};

// helper to read nested path like "productOptions[0].discountType"
const getIn = (obj: any, path: string) => {
  if (!obj || !path) return undefined;
  const parts = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
  return parts.reduce((acc: any, key: string) => (acc != null ? acc[key] : undefined), obj);
};

const BaseRadio: React.FC<Props> = ({ name, label, required, tooltip, formik, options, row = true, variant = "default", mdPerRow = 3, sx, defaultValue, onClick }) => {
  const theme = useTheme();

  // read value from formik using nested path
  const rawValue = formik ? getIn(formik.values, name) : undefined;
  const value = rawValue ?? defaultValue ?? "";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | string | number) => {
    let next: string | number;
    if (typeof event === "string" || typeof event === "number") {
      next = event;
    } else {
      const raw = (event.target as HTMLInputElement).value;
      const match = options.find((o) => String(o.value) === String(raw));
      next = match ? match.value : raw;
    }
    // set nested value via formik.setFieldValue with the same path
    formik?.setFieldValue?.(name, next);
  };

  const hasError = Boolean(formik?.touched && getIn(formik.touched, name) && formik?.errors && getIn(formik.errors, name));
  const helper = hasError ? getIn(formik.errors, name) : undefined;

  const cardSx = (active: boolean) => ({
    px: 2,
    py: 1,
    flexGrow: 1,
    textAlign: "center" as const,
    border: `1px dashed ${active ? theme.palette.primary.main : theme.palette.grey[200]}`,
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
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
        <RadioGroup row={row} name={name} value={value as any} onChange={handleChange} sx={{ width: "100%" }}>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            {options.map((opt) => (
              <Grid key={String(opt.value)} size={{ xs: 12, md: md }} sx={{ display: "flex" }}>
                <ButtonBase
                  onClick={() => {
                    handleChange(opt.value);
                    onClick?.();
                  }}
                  sx={{ width: "100%", height: "100%" }}
                >
                  <Box sx={cardSx(String(value) === String(opt.value))}>
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

  return (
    <FormControl component="fieldset" error={hasError} sx={{ width: "100%", ...sx }}>
      {label && (
        <BaseLabel required={required} tooltip={tooltip}>
          {label}
        </BaseLabel>
      )}
      <RadioGroup row={row} name={name} value={value as any} onChange={handleChange}>
        {options.map((opt) => (
          <FormControlLabel key={String(opt.value)} value={opt.value} control={<CustomRadio />} label={opt.label} />
        ))}
      </RadioGroup>
      {helper && <FormHelperText>{helper}</FormHelperText>}
    </FormControl>
  );
};

export default BaseRadio;
