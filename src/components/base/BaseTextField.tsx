"use client";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { TextField, TextFieldProps, IconButton, InputAdornment } from "@mui/material";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import BaseLabel from "./BaseLabel";

interface CustomTextFieldProps extends Omit<TextFieldProps, "name"> {
  name: string;
  label?: string;
  placeholder?: string;
  formik?: any;
  startAdornment?: React.ReactNode;
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
  // ปิด hover เมื่อ disabled
  "& .Mui-disabled:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.grey[200],
  },
  "& .MuiOutlinedInput-root.Mui-disabled:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.grey[200],
  },
  // ปิดลูกตาของ browser
  "& input[type=password]": {
    "&::-ms-reveal": {
      display: "none",
    },
    "&::-ms-clear": {
      display: "none",
    },
  },
}));

const BaseTextField = ({ name, label, placeholder, formik, startAdornment, type, ...rest }: CustomTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  let helperText = null;
  if (formik?.touched[name] && formik?.errors[name]) {
    if (typeof formik.errors[name] === "string" && formik.errors[name].includes("\n")) {
      helperText = formik.errors[name].split("\n").map((msg: string, idx: number) => (
        <span key={idx} style={{ display: "block" }}>
          {msg}
        </span>
      ));
    } else {
      helperText = formik.errors[name];
    }
  }

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const getEndAdornment = () => {
    if (type === "password") {
      return (
        <InputAdornment position="end">
          <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
            {showPassword ? <IconEyeOff width={20} /> : <IconEye width={20} />}
          </IconButton>
        </InputAdornment>
      );
    }
    return null;
  };

  return (
    <>
      {label && <BaseLabel htmlFor={name}>{label}</BaseLabel>}
      <StyledTextField
        fullWidth
        variant="outlined"
        id={name}
        name={name}
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        value={formik?.values[name]}
        onChange={formik?.handleChange}
        onBlur={formik?.handleBlur}
        placeholder={placeholder}
        error={formik?.touched[name] && Boolean(formik.errors[name])}
        helperText={helperText}
        autoComplete={type === "password" ? "new-password" : undefined}
        slotProps={{
          input: {
            startAdornment: startAdornment,
            endAdornment: getEndAdornment(),
            ...(rest.InputProps || {}),
          },
        }}
        {...rest}
      />
    </>
  );
};

export default BaseTextField;
