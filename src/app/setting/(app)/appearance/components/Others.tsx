import { AppearanceSettings } from "@/common/contexts/ProfileContext/interfaces/interface";
import { Avatar, Stack, Typography, Box } from "@mui/material";
import { cloneElement, FC, ReactElement } from "react";
import { IconShadow, IconTableDashed } from "@tabler/icons-react";
import { useProfile } from "@/common/contexts/ProfileContext";
import BaseSwitch from "@/common/components/base/BaseSwitch";
import useTheme from "@mui/system/useTheme";
import ViewSidebarTwoToneIcon from "@mui/icons-material/ViewSidebarTwoTone";

type SettingRowProps = {
  icon: ReactElement<any>;
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: () => void;
};

const SettingRow: FC<SettingRowProps> = ({ icon, title, subtitle, checked, onChange }) => {
  const theme = useTheme();
  const coloredIcon = cloneElement(icon, {
    style: { color: theme.palette.primary.main, ...(icon.props?.style || {}) },
  });

  return (
    <Stack direction="row" spacing={2} mt={4}>
      <Avatar variant="rounded" sx={{ bgcolor: "grey.100", color: "grey.500", width: 48, height: 48 }}>
        {coloredIcon}
      </Avatar>
      <Box>
        <Typography variant="h6" mb={1}>
          {title}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {subtitle}
        </Typography>
      </Box>
      <Box sx={{ ml: "auto !important" }}>
        <BaseSwitch checked={checked} onChange={onChange} />
      </Box>
    </Stack>
  );
};

const Others: FC = () => {
  const theme = useTheme();
  const { updateAppearance, appearance } = useProfile();
  const { isCollapse, isLayout, isCardShadow } = appearance || {};
  const isCollapseChecked = isCollapse === "mini_sidebar";
  const isLayoutChecked = isLayout === "boxed";

  const updateSetting = (payload: Partial<AppearanceSettings>) => {
    updateAppearance(payload);
  };

  return (
    <>
      <SettingRow
        icon={<ViewSidebarTwoToneIcon />}
        title="เมนูแบบย่อ"
        subtitle="แนะนำสำหรับหน้าจอขนาดเล็กและอุปกรณ์มือถือ"
        checked={isCollapseChecked}
        onChange={() => updateSetting({ isCollapse: isCollapseChecked ? "full_sidebar" : "mini_sidebar" })}
      />

      <SettingRow
        icon={<IconTableDashed />}
        title="โหมดกลางจอ"
        subtitle="สลับระหว่างการแสดงผลแบบเต็มหน้าจอ หรือแบบกล่องกลางจอ"
        checked={isLayoutChecked}
        onChange={() => updateSetting({ isLayout: isLayoutChecked ? "full" : "boxed" })}
      />

      <SettingRow
        icon={<IconShadow />}
        title="เงา"
        subtitle="เปิดเพื่อเพิ่มมิติให้กับการ์ดและกล่องต่างๆ"
        checked={!!isCardShadow}
        onChange={() => updateSetting({ isCardShadow: !isCardShadow })}
      />
    </>
  );
};

export default Others;
