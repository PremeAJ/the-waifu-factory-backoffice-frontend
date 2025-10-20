import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { IconUpload } from "@tabler/icons-react";
import FileItem from './FileItem';
import { UploadedFile } from './types';

interface FileListProps {
  files: UploadedFile[];
  maxFiles?: number;
  autoUpload: boolean;
  isUploading: boolean;
  onOpenLightbox: (index: number) => void;
  onUploadPending: () => Promise<void>;
  onRemoveFile: (index: number) => Promise<void>;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  maxFiles,
  autoUpload,
  isUploading,
  onOpenLightbox,
  onUploadPending,
  onRemoveFile
}) => {
  return (
    <Box m={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontSize="15px">
          Files{maxFiles ? ` : (${files.length}/${maxFiles})` : ` : ${files.length}`}
        </Typography>
        
        {!autoUpload && files.some(f => !f.id && !f.error) && (
          <IconButton 
            color="primary" 
            onClick={onUploadPending} 
            disabled={isUploading}
            size="small"
          >
            <IconUpload size={18} />
          </IconButton>
        )}
      </Box>
      
      {files.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          ยังไม่มีไฟล์ที่เลือก
        </Typography>
      ) : (
        files.map((file, i) => (
          <FileItem 
            key={i} 
            file={file} 
            index={i} 
            onRemove={onRemoveFile}
            onOpenLightbox={onOpenLightbox}
          />
        ))
      )}
    </Box>
  );
};

export default FileList;