"use client";
import React from "react";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import { TextField, Skeleton } from "@mui/material";
import BaseLabel from "./BaseLabel";

interface OptionType {
  value: any;
  text: string;
  group?: string;
}

interface BaseAutoCompleteProps<T = OptionType, Multiple extends boolean | undefined = false>
  extends Omit<AutocompleteProps<T, Multiple, false, false>, "renderInput" | "onChange" | "value"> {
  formik: any;
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  groupBy?: (option: T) => string;
  orderBy?: (a: T, b: T) => number; 
  loading?: boolean;
  renderOption?: (props: any, option: T) => React.ReactNode;
}

function BaseAutoComplete<T extends OptionType>({
  formik,
  name,
  label,
  placeholder,
  options,
  required,
  groupBy,
  orderBy, 
  loading = false,
  disabled,
  renderOption,
  ...rest
}: BaseAutoCompleteProps<T>) {
  // แก้ไข logic การหา value
  const currentValue = formik.values[name];
  const value = currentValue ? options.find((opt) => opt.value === currentValue) || null : null;
  const sortedOptions = orderBy ? [...options].sort(orderBy) : options;

  // Error state
  const hasError = formik?.touched[name] && Boolean(formik.errors[name]);
  const helperText = formik?.touched[name] && formik.errors[name];

  // Loading state
  if (loading) {
    return (
      <>
        {label && (
          <BaseLabel>
            {label}
            {required && <span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span>}
          </BaseLabel>
        )}
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
      </>
    );
  }

  return (
    <>
      {label && (
        <BaseLabel htmlFor={name}>
          {label}
          {required && <span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span>}
        </BaseLabel>
      )}
      <Autocomplete
        options={sortedOptions}
        value={value}
        onChange={(_, newValue) => {
          // แก้ไข logic การ set value
          formik.setFieldValue(name, newValue ? newValue.value : "");
        }}
        onBlur={() => formik.setFieldTouched(name, true)}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        getOptionLabel={(option) => (option.text ? String(option.text) : "")}
        groupBy={groupBy}
        disabled={disabled}
        renderOption={renderOption}
        clearOnEscape // เพิ่ม clearOnEscape
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            error={hasError}
            helperText={helperText}
            variant="outlined"
            fullWidth
            autoComplete="off"
          />
        )}
        {...rest}
      />
    </>
  );
}

export default BaseAutoComplete;
