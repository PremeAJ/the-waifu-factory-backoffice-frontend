"use client";
import React from "react";
import { FormControl, Select, MenuItem, SelectProps, Tooltip, Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import BaseLabel from "./BaseLabel";

interface OptionType {
  value: any;
  text: string;
  disabled?: boolean;
}

interface BaseDropdownProps extends Omit<SelectProps, "onChange" | "value"> {
  formik?: any;
  name: string;
  label?: string;
  placeholder?: string;
  options: OptionType[];
  required?: boolean;
  tooltip?: string;
  value?: any;
  onChange?: (value: any) => void;
  groupBy?: (option: OptionType) => string;
  orderBy?: (a: OptionType, b: OptionType) => number;
  showEmptyOption?: boolean;
  emptyOptionText?: string;
  loading?: boolean;
  renderOption?: (option: OptionType) => React.ReactNode; // เพิ่ม renderOption prop
}

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.grey[300],
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.light,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiSelect-select": {
    minHeight: "1.4375em", // รักษาความสูงให้เท่ากับ TextField
    textAlign: "left !important",
  },
  "& .MuiList-root": {
    "& .MuiMenuItem-root": {
      textAlign: "left !important",
      justifyContent: "flex-start !important",
      "& em": {
        textAlign: "left !important",
      },
    },
  },
}));

const BaseDropdown: React.FC<BaseDropdownProps> = ({
  formik,
  name,
  label,
  placeholder,
  options,
  required,
  tooltip,
  value: controlledValue,
  onChange: controlledOnChange,
  groupBy,
  orderBy,
  showEmptyOption = false,
  emptyOptionText = "-- กรุณาเลือก --",
  fullWidth = true,
  loading = false,
  size,
  renderOption, // เพิ่ม renderOption
  ...rest
}) => {
  // จัดเรียง options ถ้ามี orderBy
  const sortedOptions = orderBy ? [...options].sort(orderBy) : options;

  // จัดกลุ่ม options ถ้ามี groupBy
  const groupedOptions = groupBy 
    ? sortedOptions.reduce((groups, option) => {
        const group = groupBy(option);
        if (!groups[group]) groups[group] = [];
        groups[group].push(option);
        return groups;
      }, {} as Record<string, OptionType[]>)
    : null;

  // ค่าที่แสดงใน Select
  const currentValue = formik 
    ? (formik.values[name] !== undefined ? formik.values[name] : "") 
    : (controlledValue !== undefined ? controlledValue : "");

  // Function สำหรับจัดการการเปลี่ยนแปลงค่า
  const handleChange = (event: any) => {
    let newValue = event.target.value;
    
    // Convert string boolean back to actual boolean
    if (newValue === "true") newValue = true;
    if (newValue === "false") newValue = false;
    
    if (formik) {
      formik.setFieldValue(name, newValue);
    }
    
    if (controlledOnChange) {
      controlledOnChange(newValue);
    }
  };

  // Error state
  const hasError = formik?.touched[name] && Boolean(formik.errors[name]);
  const helperText = formik?.touched[name] && formik.errors[name];

  // 4. เพิ่ม Logic การแสดง Skeleton
  if (loading) {
    return (
      <>
        {label && <BaseLabel>{label}</BaseLabel>}
        <Skeleton variant="rectangular" width={fullWidth ? "100%" : undefined} height={44} sx={{ borderRadius: 1 }} />
      </>
    );
  }

  // Function สำหรับ render option content
  const renderOptionContent = (option: OptionType) => {
    return renderOption ? renderOption(option) : option.text;
  };

  return (
    <>
      {label && (
        <BaseLabel htmlFor={name}>
          {label}
          {required && <span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span>}
        </BaseLabel>
      )}
      {tooltip ? (
        <Tooltip title={tooltip} placement="bottom-start">
          <span style={{ display: "block" }}>
            <StyledFormControl 
              fullWidth={fullWidth} 
              error={hasError}
            >
              <Select
                value={currentValue}
                onChange={handleChange}
                onBlur={formik?.handleBlur}
                displayEmpty={!!placeholder || showEmptyOption}
                id={name}
                {...rest}
              >
                {showEmptyOption && (
                  <MenuItem value="">
                    <em>{emptyOptionText}</em>
                  </MenuItem>
                )}
                
                {placeholder && !showEmptyOption && (
                  <MenuItem value="" disabled>
                    <em>{placeholder}</em>
                  </MenuItem>
                )}
                {groupedOptions ? (
                  Object.entries(groupedOptions).map(([groupName, groupOptions]) => [
                    <MenuItem key={`group-${groupName}`} disabled>
                      <strong>{groupName}</strong>
                    </MenuItem>,
                    ...groupOptions.map((option) => (
                      <MenuItem 
                        key={option.value} 
                        value={option.value}
                        disabled={option.disabled}
                        sx={{ pl: 4 }} // indent สำหรับ grouped items
                      >
                        {option.text}
                      </MenuItem>
                    ))
                  ])
                ) : (
                  /* Render normal options */
                  sortedOptions.map((option) => (
                    <MenuItem 
                      key={option.value} 
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.text}
                    </MenuItem>
                  ))
                )}
              </Select>
              
              {/* Helper text สำหรับ error */}
              {hasError && (
                <div style={{ 
                  color: '#d32f2f', 
                  fontSize: '0.75rem', 
                  marginTop: '3px',
                  marginLeft: '14px' 
                }}>
                  {helperText}
                </div>
              )}
            </StyledFormControl>
          </span>
        </Tooltip>
      ) : (
        <StyledFormControl 
          fullWidth={fullWidth} 
          error={hasError}
        >
          <Select
            value={currentValue}
            onChange={handleChange}
            onBlur={formik?.handleBlur}
            displayEmpty={!!placeholder || showEmptyOption}
            id={name}
            {...rest}
          >
            {/* Empty option สำหรับ placeholder */}
            {showEmptyOption && (
              <MenuItem value="">
                <em>{emptyOptionText}</em>
              </MenuItem>
            )}
            
            {/* Placeholder option */}
            {placeholder && !showEmptyOption && (
              <MenuItem value="" disabled>
                <em>{placeholder}</em>
              </MenuItem>
            )}

            {/* Render grouped options */}
            {groupedOptions ? (
              Object.entries(groupedOptions).map(([groupName, groupOptions]) => [
                <MenuItem key={`group-${groupName}`} disabled>
                  <strong>{groupName}</strong>
                </MenuItem>,
                ...groupOptions.map((option) => (
                  <MenuItem 
                    key={option.value} 
                    value={option.value}
                    disabled={option.disabled}
                    sx={{ pl: 4 }} // indent สำหรับ grouped items
                  >
                    {option.text}
                  </MenuItem>
                ))
              ])
            ) : (
              /* Render normal options */
              sortedOptions.map((option) => (
                <MenuItem 
                  key={option.value} 
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.text}
                </MenuItem>
              ))
            )}
          </Select>
          
          {/* Helper text สำหรับ error */}
          {hasError && (
            <div style={{ 
              color: '#d32f2f', 
              fontSize: '0.75rem', 
              marginTop: '3px',
              marginLeft: '14px' 
            }}>
              {helperText}
            </div>
          )}
        </StyledFormControl>
      )}
    </>
  );
};

export default BaseDropdown;