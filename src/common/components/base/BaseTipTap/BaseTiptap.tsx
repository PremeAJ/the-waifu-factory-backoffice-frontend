"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton, Tooltip, Box } from "@mui/material";
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

  const handleChange = (nextContent: string) => {
    setContent(nextContent);
    if (formik) {
      formik.setFieldValue(name, nextContent);
    }
    if (onChange) {
      onChange(nextContent);
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
            <TiptapEditor
              key={name}
              content={content}
              onChange={handleChange}
              onUpdate={handleChange}
              placeholder={`${placeholder}${langText}`}
              {...rest}
            />
          </span>
        </Tooltip>
      ) : (
        <TiptapEditor key={name} content={content} onChange={handleChange} onUpdate={handleChange} placeholder={`${placeholder}${langText}`} {...rest} />
      )}
    </Box>
  );
};

export default BaseTiptap;
