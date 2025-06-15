"use client";
import React from "react";
import { Checkbox, CheckboxProps, FormControlLabel } from "@mui/material";

interface BaseCheckBoxProps extends Omit<CheckboxProps, "name"> {
  name: string;
  label?: string;
  formik?: any;
  labelPlacement?: "end" | "start" | "top" | "bottom";
}

const BaseCheckBox: React.FC<BaseCheckBoxProps> = ({ name, label, formik, labelPlacement = "end", ...rest }) => {
  const checked = formik ? Boolean(formik.values[name]) : rest.checked;
  const error = formik?.touched?.[name] && Boolean(formik?.errors?.[name]);
  const helperText = error ? formik?.errors?.[name] : undefined;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (formik) {
      formik.setFieldValue(name, event.target.checked);
    }
    if (rest.onChange) {
      rest.onChange(event, event.target.checked);
    }
  };

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            id={name}
            name={name}
            checked={checked}
            onChange={handleChange}
            onBlur={formik?.handleBlur}
            sx={{
              color: (theme) => theme.palette.primary.main,
              "&.Mui-checked": {
                color: (theme) => theme.palette.primary.main,
              },
            }}
            {...rest}
          />
        }
        label={label}
        labelPlacement={labelPlacement}
        sx={{ m: 0 }}
      />
      {helperText && <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>{helperText}</div>}
    </>
  );
};

export default BaseCheckBox;
