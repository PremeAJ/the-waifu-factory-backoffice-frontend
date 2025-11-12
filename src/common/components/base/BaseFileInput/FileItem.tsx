import { IconX } from "@tabler/icons-react";
import { truncateFileName } from "./utils";
import { UploadedFile } from './types';
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import React from 'react';
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

interface FileItemProps {
  file: UploadedFile;
  index: number;
  onRemove: (index: number) => Promise<void>;
  onOpenLightbox: (index: number) => void;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  index,
  onRemove,
  onOpenLightbox
}) => {
  const theme = useTheme();

  const fullName = file.originName || file.file?.name || "";
  const shownName = truncateFileName(fullName, 16);

  const renderChip = () => {
    if (file.deleting) {
      return (
        <Chip 
          color="error"
          label="กำลังลบ..."
          size="small"
        />
      );
    }
    
    if (file.uploading) {
      return (
        <Chip 
          color="warning"
          label="กำลังอัปโหลด..."
          size="small"
        />
      );
    }
    
    return (
      <Chip 
        color={file.id ? "success" : "primary"} 
        label={file.id 
          ? "อัปโหลดแล้ว"
          : `${Math.round(file.file.size / 1024)} KB`
        }
        size="small"
      />
    );
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      mt={1}
      sx={{ 
        borderTop: `1px solid ${theme.palette.divider}`,
        opacity: file.deleting ? 0.6 : 1,
        transition: 'opacity 0.3s',
      }}
      justifyContent="space-between"
      gap={2}
      padding={1}
    >
      {(file.url || file.file.type.startsWith("image/")) && (
        <Box
          component="img"
          // ✅ แก้ไข: ใช้ URL จาก backend ถ้ามี
          src={file.url || URL.createObjectURL(file.file)}
          alt={file.originName || file.file.name}
          sx={{
            width: 48,
            height: 48,
            objectFit: "cover",
            borderRadius: 1,
            boxShadow: 1,
            cursor: file.deleting ? 'default' : 'pointer',
            pointerEvents: file.deleting ? 'none' : 'auto',
            '&:hover': {
              opacity: file.deleting ? 1 : 0.8,
              transition: 'opacity 0.2s'
            }
          }}
          onClick={() => !file.deleting && onOpenLightbox(index)}
        />
      )}
      
      <Box sx={{ flex: 1 }}>
        <Tooltip title={fullName} placement="top" arrow>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
              flex: 1,
            }}
          >
            {shownName}
          </Typography>
        </Tooltip>
        {file.error && (
          <Typography variant="caption" color="error">
            {file.error}
          </Typography>
        )}
      </Box>
      
      {renderChip()}
      
      <IconButton 
        size="small" 
        color="error" 
        onClick={() => onRemove(index)} 
        disabled={file.deleting || file.uploading}
        sx={{ ml: 1 }}
      >
        {file.deleting ? (
          <CircularProgress size={18} color="error" />
        ) : (
          <IconX size={18} />
        )}
      </IconButton>
    </Box>
  );
};

export default FileItem;