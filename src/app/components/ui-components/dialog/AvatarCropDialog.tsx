import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Slider from '@mui/material/Slider';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import BaseButton from '../../forms/theme-elements/BaseButton';
import getCroppedImg from './cropImageUtil';

interface AvatarCropDialogProps {
  open: boolean;
  imageSrc: string | undefined;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
}

const AvatarCropDialog: React.FC<AvatarCropDialogProps> = ({ open, imageSrc, onClose, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onSave(croppedImage as string);
    }
  };

  React.useEffect(() => {
    if (!open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth fullScreen={isMobile}>
      <Box
        sx={{
          width: isMobile ? "100vw" : "100%",
          height: isMobile ? "100vh" : 500,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#333",
          borderRadius: "0px",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: isMobile ? 320 : "100%",
            height: isMobile ? 320 : 500,
            bgcolor: "#222",
            overflow: "hidden",
            mt: isMobile ? 6 : 0,
          }}
        >
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid={false} // ซ่อนตาราง
            />
          )}
          {/* วงกลม overlay */}
          <Box
            sx={{
              pointerEvents: "none",
              position: "absolute",
              top: "50%",
              left: "50%",
              width: isMobile ? 240 : 300,
              height: isMobile ? 240 : 300,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: "2px solid #fff",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
              zIndex: 10,
            }}
          />
        </Box>
        <Box px={2} py={1} display="flex" gap={1} width={isMobile ? 320 : "100%"}>
          <BaseButton onClick={onClose} preset="cancel" fullWidth />
          <BaseButton onClick={handleSave} preset="save" fullWidth />
        </Box>
        <Box px={2} py={1} width={isMobile ? 320 : "100%"}>
          <Slider value={zoom} min={1} max={3} step={0.1} onChange={(_, value) => setZoom(value as number)} />
        </Box>
      </Box>
    </Dialog>
  );
};

export default AvatarCropDialog;
