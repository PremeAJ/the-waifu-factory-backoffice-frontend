import { AppearanceSettings } from "@/common/contexts/ProfileContext/interfaces/interface";
import { Avatar, Stack, Typography } from "@mui/material";
import { IconTableDashed } from "@tabler/icons-react";
import { useProfile } from "@/common/contexts/ProfileContext";
import BaseSwitch from "@/common/components/base/BaseSwitch";
import Box from "@mui/material/Box";
import useTheme from "@mui/system/useTheme";
import ViewSidebarTwoToneIcon from "@mui/icons-material/ViewSidebarTwoTone";

const Others = () => {
  const theme = useTheme();
  const { updateAppearance, appearance } = useProfile();
  const { isCollapse, isLayout } = appearance || {};
  const isCollapseChecked = isCollapse === "mini_sidebar";
  const isLayoutChecked = isLayout === "boxed";
  const updateSetting = (payload: Partial<AppearanceSettings>) => {
    updateAppearance(payload);
  };
  return (
    <>
      <Stack direction="row" spacing={2} mt={4}>
        <Avatar variant="rounded" sx={{ bgcolor: "grey.100", color: "grey.500", width: 48, height: 48 }}>
          <ViewSidebarTwoToneIcon style={{ color: theme.palette.primary.main }} />
        </Avatar>
        <Box>
          <Typography variant="h6" mb={1}>
            เมนูแบบย่อ
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            แนะนำสำหรับหน้าจอขนาดเล็กและอุปกรณ์มือถือ
          </Typography>
        </Box>
        <Box sx={{ ml: "auto !important" }}>
          <BaseSwitch checked={isCollapseChecked} onChange={() => updateSetting({ isCollapse: isCollapseChecked ? "full_sidebar" : "mini_sidebar" })} />
        </Box>
      </Stack>
      <Stack direction="row" spacing={2} mt={4}>
        <Avatar variant="rounded" sx={{ bgcolor: "grey.100", color: "grey.500", width: 48, height: 48 }}>
          <IconTableDashed style={{ color: theme.palette.primary.main }} />
        </Avatar>
        <Box>
          <Typography variant="h6" mb={1}>
            โหมดกลางจอ
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            สลับระหว่างการแสดงผลแบบเต็มหน้าจอ หรือแบบกล่องกลางจอ
          </Typography>
        </Box>
        <Box sx={{ ml: "auto !important" }}>
          <BaseSwitch checked={isLayoutChecked} onChange={() => updateSetting({ isLayout: isLayoutChecked ? "full" : "boxed" })} />
        </Box>
      </Stack>
    </>
  );
};

export default Others;
