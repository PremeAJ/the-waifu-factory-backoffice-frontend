import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import BaseDialog from "../BaseDialog";
import { UploadedFile } from './types';

interface FileLightboxProps {
  open: boolean;
  onClose: () => void;
  imageFiles: UploadedFile[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

export const FileLightbox: React.FC<FileLightboxProps> = ({
  open,
  onClose,
  imageFiles,
  currentIndex,
  onPrev,
  onNext
}) => {
  const renderLightboxContent = () => {
    if (imageFiles.length === 0) return null;
    
    const currentImage = imageFiles[currentIndex];
    if (!currentImage) return null;
    
    return (
      <Box 
        sx={{ 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '70vh',
          backgroundColor: 'black',
          borderRadius: 1,
          overflow: 'hidden'
        }}
      >
        {imageFiles.length > 1 && (
          <IconButton
            onClick={onPrev}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.3)',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
              zIndex: 2
            }}
          >
            <IconArrowLeft />
          </IconButton>
        )}
        
        <Box
          component="img"
          src={
            currentImage.url || 
            (currentImage.file instanceof File ? URL.createObjectURL(currentImage.file) : '')
          }
          alt={currentImage.originName || currentImage.file.name || "Image"}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            zIndex: 1
          }}
        />
        
        {imageFiles.length > 1 && (
          <IconButton
            onClick={onNext}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.3)',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
              zIndex: 2
            }}
          >
            <IconArrowRight />
          </IconButton>
        )}
        
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            p: 1,
            textAlign: 'center',
            zIndex: 2
          }}
        >
          <Typography variant="body2" sx={{ color: 'white' }}>
            {currentImage.originName || currentImage.file.name || "Image"}
            {imageFiles.length > 1 && ` (${currentIndex + 1}/${imageFiles.length})`}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title=""
      content={renderLightboxContent()}
      noAction={false}
      cancelText="ปิด"
      fullScreen={false}
      scrolling={false}
      disableBackdropClose={false}
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: 'black',
          maxWidth: 'calc(100vw - 64px)',
          maxHeight: 'calc(100vh - 64px)',
          m: 2
        },
        '& .MuiDialogTitle-root': {
          display: 'none'
        },
        '& .MuiDialogContent-root': {
          p: 0,
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        },
        '& .MuiDialogActions-root': {
          backgroundColor: 'black',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        },
        '& .MuiButton-root': {
          color: 'white'
        }
      }}
    />
  );
};

export default FileLightbox;