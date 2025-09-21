import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import { Stack, Typography } from "@mui/material";
import { IconSquareFilled, IconCircleFilled } from "@tabler/icons-react";
import useMediaQuery from "@mui/system/useMediaQuery";
import useTheme from "@mui/system/useTheme";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { useContext } from "react";
import { useProfile } from "@/common/contexts/ProfileContext";

const marks = [
  { value: 4, label: "" },
  { value: 8, label: "" },
  { value: 12, label: "" },
  { value: 16, label: "" },
  { value: 20, label: "" },
  { value: 24, label: "" },
];

const Border = () => {
  const { setIsBorderRadius } = useContext(CustomizerContext);
  const { updateAppearance, appearance } = useProfile();
  const { isBorderRadius } = appearance || {};
  const updateSetting = (border: number) => {
    updateAppearance({ isBorderRadius: border });
  };
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.down("lg"));
  return (
    <Box sx={{ maxWidth: lgUp ? "100%" : "50%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconSquareFilled size={16} style={{ color: theme.palette.primary.main }} />
          <Typography variant="caption" color="text.secondary">
            เหลี่ยม
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            โค้ง
          </Typography>
          <IconCircleFilled size={16} style={{ color: theme.palette.primary.main }} />
        </Stack>
      </Stack>
      <Slider
        size="medium"
        value={isBorderRadius}
        aria-label="Border Radius"
        min={4}
        max={24}
        marks={marks}
        step={null}
        onChange={(_, value) => updateSetting(Number(value))}
        valueLabelDisplay="auto"
      />
    </Box>
  );
};

export default Border;
