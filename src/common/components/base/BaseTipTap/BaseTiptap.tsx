"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton, Tooltip, Box, FormHelperText } from "@mui/material";
import BaseLabel from "../BaseLabel";
import { IsLanguage } from "@/common/contexts/ProfileContext/interfaces/interface";

interface TiptapProps {
  content?: string;
  onChange?: (content: string) => void;
  onUpdate?: (content: string) => void;
  placeholder?: string;
  [key: string]: any;
}

// Ensure dynamic loader returns a component typed with TiptapProps
const TiptapEditor = dynamic(
  () => import("@/common/components/base/BaseTipTap/TiptapEditor").then((mod) => mod.default as React.ComponentType<TiptapProps>),
  { ssr: false }
);

interface BaseTiptapProps {
  name: string;
  formik?: any;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  lang?: IsLanguage;
  placeholder?: string;
  required?: boolean;
  loading?: boolean;
  tooltip?: string;
  labelIcon?: React.ReactNode;
  sx?: any;
  // pass-through for editor specific props
  [key: string]: any;
}

const BaseTiptap: React.FC<BaseTiptapProps> = ({
  name,
  formik,
  value,
  onChange,
  label,
  lang,
  placeholder,
  required = false,
  loading = false,
  tooltip,
  labelIcon,
  sx,
  ...rest
}) => {
  const initial = formik?.values?.[name] ?? value ?? "";
  const [content, setContent] = useState<string>(initial);
  const langText = lang ? (lang === "th" ? " (ภาษาไทย)" : " (ภาษาอังกฤษ)") : "";
  useEffect(() => {
    const next = formik?.values?.[name] ?? value;
    if (typeof next === "string" && next !== content) {
      setContent(next);
    }
  }, [formik?.values?.[name], value]);

  // derive error state from formik
  const touched = formik?.touched?.[name];
  const errorText = touched && formik?.errors?.[name] ? (formik.errors[name] as string) : "";
  const hasError = Boolean(errorText);

  const handleChange = (nextContent: string) => {
    setContent(nextContent);
    if (formik) {
      formik.setFieldValue(name, nextContent);
    }
    if (onChange) {
      onChange(nextContent);
    }
  };

  const handleBlurCapture = () => {
    if (formik?.setFieldTouched) {
      formik.setFieldTouched(name, true, true);
    }
  };

  if (loading) {
    const skeleton = <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1 }} />;

    return (
      <>
        {label && (
          <BaseLabel htmlFor={name}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {labelIcon ? <span style={{ display: "inline-flex", alignItems: "center" }}>{labelIcon}</span> : null}
              <span>{label}</span>
              {required && <span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span>}
            </span>
          </BaseLabel>
        )}
        {tooltip ? (
          <Tooltip title={tooltip} placement="bottom-start">
            <span style={{ display: "block" }}>{skeleton}</span>
          </Tooltip>
        ) : (
          skeleton
        )}
      </>
    );
  }

  return (
    <Box sx={sx}>
      {label && (
        <BaseLabel htmlFor={name}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {labelIcon ? <span style={{ display: "inline-flex", alignItems: "center" }}>{labelIcon}</span> : null}
            <span>
              {label}{langText}
            </span>
            {required && <span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span>}
          </span>
        </BaseLabel>
      )}

      {tooltip ? (
        <Tooltip title={tooltip} placement="bottom-start">
          <span style={{ display: "block" }}>
            <Box
              onBlurCapture={handleBlurCapture}
              sx={{
                border: hasError ? 1 : 'none',
                borderColor: hasError ? "error.main" : "divider",
                "& .ProseMirror": { minHeight: 120, outline: "none" },
              }}
            >
              <TiptapEditor
                key={name}
                content={content}
                onChange={handleChange}
                onUpdate={handleChange}
                placeholder={placeholder}
                aria-invalid={hasError || undefined}
                {...rest}
              />
            </Box>
            {hasError ? <FormHelperText error>{errorText}</FormHelperText> : null}
          </span>
        </Tooltip>
      ) : (
        <>
          <Box
            onBlurCapture={handleBlurCapture}
            sx={{
              border: hasError ? 1 : 'none',
              borderColor: hasError ? "error.main" : "divider",
              "& .ProseMirror": { minHeight: 120, outline: "none" },
            }}
          >
            <TiptapEditor
              key={name}
              content={content}
              onChange={handleChange}
              onUpdate={handleChange}
              placeholder={placeholder}
              aria-invalid={hasError || undefined}
              {...rest}
            />
          </Box>
          {hasError ? <FormHelperText error>{errorText}</FormHelperText> : null}
        </>
      )}
    </Box>
  );
};

export default BaseTiptap;
