"use client";
import { TextField, Skeleton } from "@mui/material";
import { useState } from "react";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import Backdrop from "@mui/material/Backdrop";
import BaseLabel from "./BaseLabel";
import Portal from "@mui/material/Portal";
interface BaseAutoCompleteProps<T = any> extends Omit<AutocompleteProps<T, boolean, false, boolean>, "renderInput" | "onChange" | "value"> {
  formik?: any;
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  orderBy?: (a: T, b: T) => number;
  loading?: boolean;
  renderOption?: (props: any, option: T) => React.ReactNode;
  renderInput?: (params: any) => React.ReactNode;
  value?: any;
  onChange?: (value: any) => void;
  toValue?: (option: T) => any;
  dimOnOpen?: boolean;
  backdropSx?: any;
  highlightOnOpen?: boolean;
  highlightSx?: any;
}

function BaseAutoComplete<T = any>({
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
  renderInput: renderInputProp,
  toValue,
  value: valueProp,
  onChange: onValueChange,
  dimOnOpen = true,
  backdropSx,
  highlightOnOpen = true,
  highlightSx,
  ...rest
}: BaseAutoCompleteProps<T>) {
  const [open, setOpen] = useState(false);
  const isMultiple = Boolean(rest.multiple);
  const isFreeSolo = Boolean(rest.freeSolo);

  const sortedOptions = orderBy ? [...(options as T[])]?.sort(orderBy as any) : (options as T[]);
  const isStringOption = Array.isArray(sortedOptions) && typeof (sortedOptions?.[0] as any) === "string";
  const getLabel = (option: any) => (typeof option === "string" ? option : option?.text ?? option?.label ?? String(option ?? ""));
  const getOptionValue = (option: any) => (toValue ? toValue(option as T) : typeof option === "string" ? option : option?.value ?? option);

  const formikValue = formik && name ? formik.values?.[name] : undefined;
  const rawValue = valueProp !== undefined ? valueProp : formikValue;

  let acValue: any = isMultiple ? [] : null;
  if (isMultiple) {
    if (isFreeSolo || isStringOption) {
      acValue = Array.isArray(rawValue) ? rawValue : [];
    } else {
      const set = new Set(Array.isArray(rawValue) ? rawValue : []);
      acValue = (sortedOptions || []).filter((opt: any) => set.has(getOptionValue(opt)));
    }
  } else {
    if (isFreeSolo || isStringOption) {
      acValue = rawValue ?? null;
    } else {
      acValue = (sortedOptions || []).find((opt: any) => getOptionValue(opt) === rawValue) ?? (rawValue ? null : null);
    }
  }

  const hasError = name ? formik?.touched?.[name] && Boolean(formik?.errors?.[name]) : false;
  const helperText = name ? formik?.touched?.[name] && formik?.errors?.[name] : undefined;

  if (loading) {
    return (
      <>
        {label && (
          <BaseLabel>
            {label}
            {required && <span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span>}
          </BaseLabel>
        )}
        <Skeleton variant="rectangular" width="100%" height={44} sx={{ borderRadius: 1 }} />
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
      <Portal>
        <Backdrop
          open={!!open && dimOnOpen}
          onClick={() => setOpen(false)}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: (t) => t.zIndex.modal,
            backgroundColor: "rgba(0,0,0,0.16)",
            ...backdropSx,
          }}
        />
      </Portal>
      <Autocomplete
        options={sortedOptions as any}
        value={acValue as any}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        sx={{ zIndex: (t) => t.zIndex.modal + 2 }} 
        slotProps={{
          popper: { sx: { zIndex: (t) => t.zIndex.modal + 1 } },
          paper: { sx: { zIndex: (t) => t.zIndex.modal + 1 } },
        }}
        onChange={(_, newValue: any) => {
          let mapped: any;
          if (isMultiple) {
            const arr = Array.isArray(newValue) ? newValue : [];
            if (isFreeSolo || isStringOption) {
              mapped = arr.map((v) => (typeof v === "string" ? v : getLabel(v)));
            } else {
              mapped = arr.map((v) => getOptionValue(v));
            }
          } else {
            if (isFreeSolo || isStringOption) {
              mapped = typeof newValue === "string" ? newValue : newValue ? getLabel(newValue) : "";
            } else {
              mapped = newValue ? getOptionValue(newValue) : "";
            }
          }
          if (formik && name) formik.setFieldValue(name, mapped);
          if (typeof onValueChange === "function") onValueChange(mapped);
        }}
        onBlur={() => (formik && name ? formik.setFieldTouched(name, true) : undefined)}
        isOptionEqualToValue={(option: any, value: any) =>
          isStringOption || isFreeSolo ? option === value : getOptionValue(option) === getOptionValue(value)
        }
        getOptionLabel={(option: any) => getLabel(option)}
        groupBy={groupBy as any}
        disabled={disabled}
        renderOption={renderOption}
        clearOnEscape
        renderInput={(params) =>
          renderInputProp ? (
            renderInputProp(params)
          ) : (
            <TextField
              {...params}
              placeholder={placeholder}
              error={hasError}
              helperText={helperText}
              variant="outlined"
              fullWidth
              autoComplete="off"
              sx={{
                ...(open && highlightOnOpen
                  ? {
                      position: "relative",
                      zIndex: (t) => t.zIndex.modal + 2,
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "background.paper",
                        boxShadow: "0 0 0 3px rgba(99,175,255,.28), 0 8px 24px rgba(0,0,0,.18)",
                      },
                      ...highlightSx,
                    }
                  : {}),
              }}
            />
          )
        }
        {...rest}
      />
    </>
  );
}

export default BaseAutoComplete;
