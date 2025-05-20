"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import { TextField, TextFieldProps } from "@mui/material";
import CustomFormLabel from "./CustomFormLabel";

interface CustomTextFieldProps extends Omit<TextFieldProps, "name"> {
  name: string;
  label?: string;
  placeholder?: string;
  formik: any
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
  label,
  placeholder,
  formik,
  ...rest
}: CustomTextFieldProps) => {
  let helperText = null;
  if (formik?.touched[name] && formik?.errors[name]) {
    if (typeof formik.errors[name] === "string" && formik.errors[name].includes("\n")) {
      helperText = formik.errors[name].split("\n").map((msg: string, idx: number) => (
        <span key={idx} style={{ display: "block" }}>{msg}</span>
      ));
    } else {
      helperText = formik.errors[name];
    }
  }

  return (
    <>
      <CustomFormLabel htmlFor={name}>{label}</CustomFormLabel>
      <StyledTextField
        fullWidth
        variant="outlined"
        id={name}
        name={name}
        value={formik?.values[name]}
        onChange={formik?.handleChange}
        onBlur={formik?.handleBlur}
        placeholder={placeholder}
        error={formik?.touched[name] && Boolean(formik.errors[name])}
        helperText={helperText}
        {...rest}
      />
    </>
  );
};

export default BaseTextField;
