"use client";
import React from "react";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import BaseTextField from "./BaseTextField";

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
  orderBy?: (a: T, b: T) => number; // เพิ่ม prop นี้
}

function BaseAutoComplete<T extends OptionType>({
  formik,
  name,
  label,
  placeholder,
  options,
  required,
  groupBy,
  orderBy, // รับ prop นี้
  ...rest
}: BaseAutoCompleteProps<T>) {
  const value = options.find((opt) => opt.value === formik.values[name]) || null;
  const sortedOptions = orderBy ? [...options].sort(orderBy) : options;

  return (
    <Autocomplete
      options={sortedOptions}
      value={value}
      onChange={(_, newValue) => {
        formik.setFieldValue(name, newValue ? newValue.value : "");
      }}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => (option.text ? String(option.text) : "")}
      groupBy={groupBy}
      renderInput={(params) => (
        <BaseTextField
          {...params}
          name={name}
          label={label}
          placeholder={placeholder}
          formik={formik}
          required={required}
          autoComplete="off"
        />
      )}
      {...rest}
    />
  );
}

export default BaseAutoComplete;
