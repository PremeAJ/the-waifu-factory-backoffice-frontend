"use client";
import React from "react";
import { FormControl, Select, MenuItem, SelectProps, Tooltip, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import BaseLabel from "./BaseLabel";
import { renderTablerIcon } from "@/common/utils/icon/getTablerIcon";

export interface OptionType {
  value: any;
  text: string;
  disabled?: boolean;
  icon?: string | null;
  group?: string;
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
  renderOption?: (option: OptionType) => React.ReactNode;
  dimOnOpen?: boolean; // เพิ่มตัวเลือกให้ dim พื้นหลังเมื่อเปิดเมนู
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
    minHeight: "1.4375em",
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
  dimOnOpen = true,
  emptyOptionText = "-- กรุณาเลือก --",
  formik,
  fullWidth = true,
  groupBy,
  label,
  loading = false,
  name,
  onChange: controlledOnChange,
  options,
  orderBy,
  placeholder,
  renderOption,
  required,
  showEmptyOption = false,
  size,
  tooltip,
  value: controlledValue,
  ...rest
}) => {
  const isMultiple = Boolean((rest as any).multiple);
  const sortedOptions = orderBy ? [...options].sort(orderBy) : options;

  const groupedOptions = groupBy
    ? sortedOptions.reduce((groups, option) => {
        const group = groupBy(option);
        if (!groups[group]) groups[group] = [];
        groups[group].push(option);
        return groups;
      }, {} as Record<string, OptionType[]>)
    : null;

  // ensure correct default by mode
  const fv = formik ? formik.values?.[name] : undefined;
  let currentValue =
    controlledValue !== undefined
      ? controlledValue
      : fv !== undefined
      ? fv
      : isMultiple
      ? []
      : "";
  if (isMultiple && !Array.isArray(currentValue)) {
    currentValue = currentValue === "" || currentValue == null ? [] : [currentValue];
  }

  const handleChange = (event: any) => {
    let newValue = event.target.value;
    if (isMultiple) {
      if (newValue === "" || newValue == null) newValue = [];
    } else {
      if (newValue === "true") newValue = true;
      if (newValue === "false") newValue = false;
    }
    if (formik) {
      formik.setFieldValue(name, newValue);
    }
    if (controlledOnChange) {
      controlledOnChange(newValue);
    }
  };

  const hasError = formik?.touched[name] && Boolean(formik.errors[name]);
  const helperText = formik?.touched[name] && formik.errors[name];

  if (loading) {
    return (
      <>
        {label && <BaseLabel>{label}</BaseLabel>}
        <Skeleton variant="rectangular" width={fullWidth ? "100%" : undefined} height={44} sx={{ borderRadius: 1 }} />
      </>
    );
  }

  const renderOptionContent = (option: OptionType) => {
    if (renderOption) return renderOption(option);
    if (option.icon) {
      return (
        <Box display="flex" alignItems="center" gap={1}>
          {renderTablerIcon(option.icon, { size: 16 })}
          {option.text}
        </Box>
      );
    }
    return option.text;
  };

  // default renderValue supports multiple + placeholder
  const mapText = new Map(sortedOptions.map((o) => [o.value, o.text]));
  const defaultRenderValue = (selected: any) => {
    if (isMultiple) {
      const arr = Array.isArray(selected) ? selected : [];
      if (!arr.length) return <em>{placeholder ?? emptyOptionText}</em>;
      return arr.map((v) => mapText.get(v) ?? String(v)).join(", ");
    }
    if ((selected === "" || selected == null) && (placeholder || showEmptyOption)) {
      return <em>{placeholder ?? emptyOptionText}</em>;
    }
    // try to render icon + text for single selection if available
    const opt = sortedOptions.find((o) => String(o.value) === String(selected));
    if (opt?.icon) {
      return (
        <Box display="flex" alignItems="center" gap={1}>
          {renderTablerIcon(opt.icon, { size: 16 })}
          {opt.text}
        </Box>
      );
    }
    return mapText.get(selected) ?? String(selected ?? "");
  };

  // รวม MenuProps พร้อม Backdrop ให้ทึบพื้นหลัง
  const { MenuProps: restMenuProps, ...restSelectProps } = rest as any;
  const mergedMenuProps = {
    ...(restMenuProps || {}),
    // รองรับทั้ง BackdropProps (เวอร์ชั่นเก่า) และ slotProps.backdrop (MUI v5)
    BackdropProps: dimOnOpen
      ? {
          ...(restMenuProps?.BackdropProps || {}),
          invisible: false,
          sx: {
            backgroundColor: "rgba(0,0,0,0.16)",
            ...(restMenuProps?.BackdropProps?.sx || {}),
          },
        }
      : restMenuProps?.BackdropProps,
    slotProps: {
      ...(restMenuProps?.slotProps || {}),
      backdrop: dimOnOpen
        ? {
            ...(restMenuProps?.slotProps?.backdrop || {}),
            invisible: false,
            sx: {
              backgroundColor: "rgba(0,0,0,0.16)",
              ...(restMenuProps?.slotProps?.backdrop?.sx || {}),
            },
          }
        : restMenuProps?.slotProps?.backdrop,
    },
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
            <StyledFormControl fullWidth={fullWidth} error={hasError}>
              <Select
                name={name}
                value={currentValue}
                onChange={handleChange}
                onBlur={formik?.handleBlur}
                displayEmpty={!!placeholder || showEmptyOption}
                id={name}
                renderValue={(rest as any).renderValue ?? defaultRenderValue}
                MenuProps={mergedMenuProps}
                {...restSelectProps}
              >
                {showEmptyOption && !isMultiple && (
                  <MenuItem value="">
                    <em>{emptyOptionText}</em>
                  </MenuItem>
                )}
                {placeholder && !showEmptyOption && !isMultiple && (
                  <MenuItem value="" disabled>
                    <em>{placeholder}</em>
                  </MenuItem>
                )}
                {groupedOptions
                  ? Object.entries(groupedOptions).map(([groupName, groupOptions]) => [
                      <MenuItem key={`group-${groupName}`} disabled>
                        <strong>{groupName}</strong>
                      </MenuItem>,
                      ...groupOptions.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                          sx={{ pl: 4 }}
                        >
                          {renderOptionContent(option)}
                        </MenuItem>
                      )),
                    ])
                  : sortedOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                        {renderOptionContent(option)}
                      </MenuItem>
                    ))}
              </Select>
              {hasError && (
                <div
                  style={{
                    color: "#d32f2f",
                    fontSize: "0.75rem",
                    marginTop: "3px",
                    marginLeft: "14px",
                  }}
                >
                  {helperText}
                </div>
              )}
            </StyledFormControl>
          </span>
        </Tooltip>
      ) : (
        <StyledFormControl fullWidth={fullWidth} error={hasError}>
          <Select
            name={name}
            value={currentValue}
            onChange={handleChange}
            onBlur={formik?.handleBlur}
            displayEmpty={!!placeholder || showEmptyOption}
            id={name}
            renderValue={(rest as any).renderValue ?? defaultRenderValue}
            MenuProps={mergedMenuProps}
            {...restSelectProps}
          >
            {showEmptyOption && !isMultiple && (
              <MenuItem value="">
                <em>{emptyOptionText}</em>
              </MenuItem>
            )}
            {placeholder && !showEmptyOption && !isMultiple && (
              <MenuItem value="" disabled>
                <em>{placeholder}</em>
              </MenuItem>
            )}
            {groupedOptions
              ? Object.entries(groupedOptions).map(([groupName, groupOptions]) => [
                  <MenuItem key={`group-${groupName}`} disabled>
                    <strong>{groupName}</strong>
                  </MenuItem>,
                  ...groupOptions.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      sx={{ pl: 4 }}
                    >
                      {renderOptionContent(option)}
                    </MenuItem>
                  )),
                ])
              : sortedOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                    {renderOptionContent(option)}
                  </MenuItem>
                ))}
          </Select>
          {hasError && (
            <div
              style={{
                color: "#d32f2f",
                fontSize: "0.75rem",
                marginTop: "3px",
                marginLeft: "14px",
              }}
            >
              {helperText}
            </div>
          )}
        </StyledFormControl>
      )}
    </>
  );
};

export default BaseDropdown;