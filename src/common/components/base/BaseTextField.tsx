"use client";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { TextField, TextFieldProps, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { IconEye, IconEyeOff, IconSearch, IconX } from "@tabler/icons-react";
import BaseLabel from "./BaseLabel";

interface CustomTextFieldProps extends Omit<TextFieldProps, "name"> {
  name: string;
  label?: string;
  placeholder?: string;
  formik?: any;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  required?: boolean;
  tooltip?: string; 
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

const BaseTextField = ({ 
  name, 
  label, 
  placeholder, 
  formik, 
  startAdornment, 
  endAdornment,
  type, 
  required, 
  tooltip, 
  ...rest 
}: CustomTextFieldProps) => {
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

  const handleClearSearch = () => {
    if (formik) {
      formik.setFieldValue(name, "");
    } else if (rest.onChange) {
      // สำหรับกรณีที่ไม่ใช้ formik
      rest.onChange({ target: { name, value: "" } } as any);
    }
  };

  const getStartAdornment = () => {
    // ถ้ามี manual startAdornment ให้ใช้ตัวนั้น
    if (startAdornment) return startAdornment;
    
    // ถ้าเป็น type search ให้ใส่ search icon
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
    // ถ้ามี manual endAdornment ให้ใช้ตัวนั้น
    if (endAdornment) return endAdornment;
    
    if (type === "password") {
      return (
        <InputAdornment position="end">
          <IconButton 
            aria-label="toggle password visibility" 
            onClick={handleClickShowPassword} 
            onMouseDown={handleMouseDownPassword} 
            edge="end"
          >
            {showPassword ? <IconEyeOff width={20} /> : <IconEye width={20} />}
          </IconButton>
        </InputAdornment>
      );
    }
    
    // ถ้าเป็น type search และมีค่า ให้ใส่ปุ่มล้าง
    if (type === "search") {
      const currentValue = formik?.values[name] || rest.value || "";
      if (currentValue) {
        return (
          <InputAdornment position="end">
            <IconButton 
              aria-label="clear search" 
              onClick={handleClearSearch}
              edge="end"
              size="small"
            >
              <IconX size={16} />
            </IconButton>
          </InputAdornment>
        );
      }
    }
    
    return null;
  };

  const textField = (
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
          startAdornment: getStartAdornment(),
          endAdornment: getEndAdornment(),
          ...(rest.slotProps?.input || {}),
        },
      }}
      {...rest}
    />
  );

  return (
    <>
      {label && (
        <BaseLabel htmlFor={name}>
          {label}
          {required && <span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span>}
        </BaseLabel>
      )}
      {tooltip ? (
        <Tooltip title={tooltip} placement="bottom-start" >
          <span style={{ display: "block" }}>{textField}</span>
        </Tooltip>
      ) : (
        textField
      )}
    </>
  );
};

export default BaseTextField;
