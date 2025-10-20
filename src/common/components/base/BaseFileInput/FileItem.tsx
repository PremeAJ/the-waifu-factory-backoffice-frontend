import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { IconX } from "@tabler/icons-react";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import { UploadedFile } from './types';

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

  return (
    <Box
      display="flex"
      alignItems="center"
      mt={1}
      sx={{ 
        borderTop: `1px solid ${theme.palette.divider}`,
        opacity: file.deleting ? 0.6 : 1,
      }}
      justifyContent="space-between"
      gap={2}
      padding={1}
    >
      {(file.url || file.file.type.startsWith("image/")) && (
        <Box
          component="img"
          src={file.url || URL.createObjectURL(file.file)}
          alt={file.originName || file.file.name}
          sx={{
            width: 48,
            height: 48,
            objectFit: "cover",
            borderRadius: 1,
            boxShadow: 1,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
              transition: 'opacity 0.2s'
            }
          }}
          onClick={() => onOpenLightbox(index)}
        />
      )}
      
      <Box sx={{ flex: 1 }}>
        <Tooltip title={file.originName || file.file.name}>
          <Typography variant="body1" fontWeight="500" noWrap>
            {file.originName || file.file.name}
          </Typography>
        </Tooltip>
        {file.error && (
          <Typography variant="caption" color="error">
            {file.error}
          </Typography>
        )}
      </Box>
      
      {file.uploading ? (
        <Box display="flex" alignItems="center" gap={1}>
          <CircularProgress size={16} variant="determinate" value={file.progress} />
          <Typography variant="caption">{file.progress}%</Typography>
        </Box>
      ) : (
        <Chip 
          color={file.id ? "success" : "primary"} 
          label={file.id 
            ? "อัปโหลดแล้ว"
            : `${Math.round(file.file.size / 1024)} KB`
          }
          size="small"
        />
      )}
      
      {file.deleting ? (
        <CircularProgress size={16} sx={{ mx: 1 }} />
      ) : (
        <IconButton size="small" color="error" onClick={() => onRemove(index)} sx={{ ml: 1 }}>
          <IconX size={18} />
        </IconButton>
      )}
    </Box>
  );
};

export default FileItem;