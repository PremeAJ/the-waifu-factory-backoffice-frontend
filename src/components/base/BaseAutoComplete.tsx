"use client";
import React from "react";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import BaseTextField from "./BaseTextField";

interface OptionType {
  value: any;
  text: string;
  group?: string; // เพิ่ม field สำหรับ group
}

interface BaseAutoCompleteProps<T = OptionType, Multiple extends boolean | undefined = false>
  extends Omit<AutocompleteProps<T, Multiple, false, false>, "renderInput" | "onChange" | "value"> {
  formik: any;
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  groupBy?: (option: T) => string; // เพิ่ม prop groupBy
}

function BaseAutoComplete<T extends OptionType>({
  formik,
  name,
  label,
  placeholder,
  options,
  required,
  groupBy, // รับ prop groupBy
  ...rest
}: BaseAutoCompleteProps<T>) {
  const value = options.find((opt) => opt.value === formik.values[name]) || null;

  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, newValue) => {
        formik.setFieldValue(name, newValue ? newValue.value : "");
      }}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => (option.text ? String(option.text) : "")}
      groupBy={groupBy} // เพิ่มตรงนี้
      renderInput={(params) => (
        <BaseTextField
          {...params}
          name={name}
          label={label}
          placeholder={placeholder}
          formik={formik}
          required={required}
        />
      )}
      {...rest}
    />
  );
}

export default BaseAutoComplete;
