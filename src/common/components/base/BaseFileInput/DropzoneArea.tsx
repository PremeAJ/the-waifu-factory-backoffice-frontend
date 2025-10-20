import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { IconUpload } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";

interface DropzoneAreaProps {
  placeholder: string;
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
}

export const DropzoneArea: React.FC<DropzoneAreaProps> = ({
  placeholder,
  getRootProps,
  getInputProps,
  isDragActive
}) => {
  const theme = useTheme();

  return (
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
  );
};

export default DropzoneArea;