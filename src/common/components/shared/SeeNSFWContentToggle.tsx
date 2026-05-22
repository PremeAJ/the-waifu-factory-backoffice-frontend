"use client";
import React from "react";
import { useNsfw } from "@/common/contexts/NsfwContext";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

interface SeeNSFWContentToggleProps {
  value?: boolean;
  onChange?: (checked: boolean) => void;
}

const SeeNSFWContentToggle: React.FC<SeeNSFWContentToggleProps> = ({ value, onChange }) => {
  const { showNsfw, setShowNsfw } = useNsfw();
  const checked = typeof value === "boolean" ? value : showNsfw;

  const handleClick = () => {
    const next = !checked;
    setShowNsfw(next);
    onChange?.(next);
  };

  return (
    <Tooltip title={checked ? "Switch to SFW mode" : "Switch to NSFW mode"}>
      <ButtonBase
        onClick={handleClick}
        sx={{
          borderRadius: 1.5,
          px: 1,
          py: 0.5,
          color: checked ? "error.main" : "text.secondary",
          transition: "color 0.2s",
          "&:hover": { opacity: 0.75 },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {checked ? <IconEye size={16} /> : <IconEyeOff size={16} />}
          <Typography variant="caption" fontWeight={700} lineHeight={1} sx={{ fontSize: 12 }}>
            {checked ? "NSFW" : "SFW"}
          </Typography>
        </Stack>
      </ButtonBase>
    </Tooltip>
  );
};

export default SeeNSFWContentToggle;
