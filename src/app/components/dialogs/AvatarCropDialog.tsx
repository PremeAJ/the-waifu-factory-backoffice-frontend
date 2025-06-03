import React from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import getCroppedImg from "./cropImageUtil";
import BaseButton from "../forms/theme-elements/BaseButton";

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

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onSave(croppedImage as string);
    }
  };

  // reset state when dialog closed
  React.useEffect(() => {
    if (!open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ position: "relative", width: "100%", height: 300, bgcolor: "#333" }}>
        {imageSrc && (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        )}
      </Box>
      <Box px={2} py={1} display="flex" gap={1}>
        <BaseButton onClick={onClose} preset="cancel" />
        <BaseButton onClick={handleSave} preset="save" />
      </Box>
      <Box px={2} py={1}>
        <Slider value={zoom} min={1} max={3} step={0.1} onChange={(_, value) => setZoom(value as number)} />
      </Box>
    </Dialog>
  );
};

export default AvatarCropDialog;
