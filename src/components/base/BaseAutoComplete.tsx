"use client";
import React from "react";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import BaseTextField from "./BaseTextField";

interface BaseAutoCompleteProps<T, Multiple extends boolean | undefined = false>
  extends Omit<AutocompleteProps<T, Multiple, false, false>, "renderInput" | "onChange" | "value"> {
  formik: any;
  name: string;
  label?: string;
  placeholder?: string;
  optionValueKey: keyof T;
  optionLabelKey: keyof T;
}

function BaseAutoComplete<T extends Record<string, any>>({
  formik,
  name,
  label,
  placeholder,
  optionValueKey,
  optionLabelKey,
  options,
  ...rest
}: BaseAutoCompleteProps<T>) {
  const value = options.find((opt) => opt[optionValueKey] === formik.values[name]) || null;

  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, newValue) => {
        formik.setFieldValue(name, newValue ? newValue[optionValueKey] : "");
      }}
      isOptionEqualToValue={(option, value) => option[optionValueKey] === value[optionValueKey]}
      getOptionLabel={(option) => (option[optionLabelKey] ? String(option[optionLabelKey]) : "")}
      renderInput={(params) => {
        return (
          <BaseTextField
            {...params}
            name={name}
            label={label}
            placeholder={placeholder}
            formik={formik}
          />
        );
      }}
      {...rest}
    />
  );
}

export default BaseAutoComplete;
