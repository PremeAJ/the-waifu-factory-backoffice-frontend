"use client";
import React, { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import { useDropzone } from "react-dropzone";
import IconButton from "@mui/material/IconButton";
import { IconX, IconUpload } from "@tabler/icons-react";
import BaseLabel from "./BaseLabel";

interface BaseFileInputProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  multiple?: boolean;
  accept?: string | string[];
  maxSize?: number;
  maxFiles?: number;
  onChange?: (files: File[]) => void;
}

const BaseFileInput: React.FC<BaseFileInputProps> = ({
  label,
  required = false,
  placeholder = "Drag & drop files here, or click to select files",
  multiple = false,
  accept = ["image/png", "image/jpeg", "image/jpg"],
  maxSize,
  maxFiles,
  onChange,
}) => {
  const theme = useTheme();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      let validFiles = acceptedFiles;
      let errorMsg = "";

      if (maxSize) {
        validFiles = validFiles.filter((file) => {
          if (file.size > maxSize) {
            errorMsg = `ไฟล์ ${file.name} มีขนาดเกิน ${Math.round(maxSize / 1024)} KB`;
            return false;
          }
          return true;
        });
      }

      // จำกัดจำนวนไฟล์สูงสุด
      if (maxFiles && validFiles.length > maxFiles) {
        validFiles = validFiles.slice(0, maxFiles);
        errorMsg = `เลือกไฟล์ได้สูงสุด ${maxFiles} ไฟล์`;
      }

      setFiles(validFiles);
      setError(errorMsg || (fileRejections.length > 0 ? "ไฟล์ไม่ถูกต้อง" : null));
      if (onChange) onChange(validFiles);
    },
    [maxSize, maxFiles, onChange]
  );

  const normalizedAccept = Array.isArray(accept)
    ? accept.reduce((acc, type) => {
        acc[type] = [];
        return acc;
      }, {} as Record<string, string[]>)
    : typeof accept === "string"
    ? { [accept]: [] }
    : undefined;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: normalizedAccept,
    maxSize,
  });

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    if (onChange) onChange(newFiles);
  };

  return (
    <Box>
      {label && (
        <BaseLabel sx={{ m: 2 }} required={required}>
          {label}
        </BaseLabel>
      )}
      <Box
        m={2}
        fontSize="12px"
        sx={{
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
          padding: "30px",
          textAlign: "center",
          border: `1px dashed ${theme.palette.primary.main}`,
          cursor: "pointer",
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <IconUpload size={22} />
          <Typography>{isDragActive ? "ปล่อยไฟล์ที่นี่..." : placeholder}</Typography>
        </Box>
      </Box>
      {error && (
        <Typography color="error" mt={1} textAlign="center">
          {error}
        </Typography>
      )}
      <Box m={2}>
        <Typography variant="h6" fontSize="15px">
          Files{maxFiles ? ` : (${files.length}/${maxFiles})` : ` : ${files.length}`}
        </Typography>
        {files.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            ยังไม่มีไฟล์ที่เลือก
          </Typography>
        ) : (
          files.map((file, i) => (
            <Box
              key={i}
              display="flex"
              alignItems="center"
              mt={1}
              sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
              justifyContent="space-between"
              gap={2}
              padding={1}
            >
              {/* ภาพ preview ถ้าเป็นไฟล์รูป */}
              {file.type.startsWith("image/") && (
                <Box
                  component="img"
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  sx={{
                    width: 48,
                    height: 48,
                    objectFit: "cover",
                    borderRadius: 1,
                    boxShadow: 1,
                  }}
                />
              )}
              <Typography variant="body1" fontWeight="500" sx={{ flex: 1 }}>
                {file.name}
              </Typography>
              <Chip color="primary" label={`${Math.round(file.size / 1024)} KB`} />
              <IconButton size="small" color="error" onClick={() => handleRemoveFile(i)} sx={{ ml: 1 }}>
                <IconX size={18} />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default BaseFileInput;
