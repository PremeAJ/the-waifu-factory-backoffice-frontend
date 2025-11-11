"use client";
import React from "react";
import { Box, FormControl, FormLabel, alpha, useTheme } from "@mui/material";
import { FormikProps } from "formik";

interface BaseColorPickerProps {
  formik?: FormikProps<any>;
  name: string;
  label?: string;
  required?: boolean;
  colors?: string[];
  loading?: boolean;
}

const DEFAULT_COLORS = [
  "#FFE082", // Bright Yellow
  "#FFAB91", // Bright Peach
  "#FF9966", // Bright Orange
  "#FF7777", // Bright Coral
  "#FF6B9D", // Bright Pink
  "#F48FB1", // Bright Light Pink
  "#CE93D8", // Bright Lavender
  "#9FA8DA", // Bright Purple Blue
  "#64B5F6", // Bright Sky Blue
  "#4DD0E1", // Bright Turquoise
  "#81C784", // Bright Mint Green
  "#AED581", // Bright Light Green
];

const BaseColorPicker: React.FC<BaseColorPickerProps> = ({
  formik,
  name,
  label,
  required = false,
  colors = DEFAULT_COLORS,
  loading = false,
}) => {
  const theme = useTheme();
  const value = formik?.values[name] || "";
  const error = formik?.touched[name] && formik?.errors[name];

  const handleColorSelect = (color: string) => {
    if (loading) return;
    formik?.setFieldValue(name, color);
    formik?.setFieldTouched(name, true);
  };

  return (
    <FormControl fullWidth error={!!error}>
      {label && (
        <FormLabel
          sx={{
            mb: 1,
            fontSize: "0.875rem",
            color: error ? "error.main" : "text.primary",
            "&.Mui-focused": {
              color: error ? "error.main" : "primary.main",
            },
          }}
        >
          {label}
          {required && (
            <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>
              *
            </Box>
          )}
        </FormLabel>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 1.5,
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        {colors.map((color) => {
          const isSelected = value === color;
          return (
            <Box
              key={color}
              onClick={() => handleColorSelect(color)}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: color,
                cursor: "pointer",
                border: isSelected ? `3px solid ${theme.palette.primary.main}` : `2px solid ${alpha(color, 0.3)}`,
                boxShadow: isSelected ? `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}` : "none",
                transition: "all 0.2s ease",
                position: "relative",
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: `0 4px 8px ${alpha(color, 0.4)}`,
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              {isSelected && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "white",
                    boxShadow: `0 2px 4px ${alpha("#000", 0.2)}`,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      {error && (
        <Box
          sx={{
            color: "error.main",
            fontSize: "0.75rem",
            mt: 0.5,
            ml: 1.5,
          }}
        >
          {String(error)}
        </Box>
      )}
    </FormControl>
  );
};

export default BaseColorPicker;