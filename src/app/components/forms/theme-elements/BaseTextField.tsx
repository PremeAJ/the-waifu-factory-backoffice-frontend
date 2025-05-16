"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import { TextField, TextFieldProps } from "@mui/material";
import { Controller, Control, FieldValues } from "react-hook-form";
import CustomFormLabel from "./CustomFormLabel";

interface CustomTextFieldProps extends Omit<TextFieldProps, "name"> {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
}

const StyledTextField = styled(TextField)(({ theme }) => ({
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
}));

const BaseTextField = ({
  name,
  control,
  label,
  placeholder,
  ...rest
}: CustomTextFieldProps) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <>
        <CustomFormLabel htmlFor={name}>{label}</CustomFormLabel>
        <StyledTextField
          fullWidth
          variant="outlined"
          {...field}
          placeholder={placeholder}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          {...rest}
        />
      </>
    )}
  />
);

export default BaseTextField;
