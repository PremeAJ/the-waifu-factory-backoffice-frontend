import Box from "@mui/material/Box";
import { Avatar, Stack, Typography } from "@mui/material";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { useContext } from "react";
import CustomSwitch from "@/components/forms/theme-elements/CustomSwitch";
import ViewSidebarTwoToneIcon from "@mui/icons-material/ViewSidebarTwoTone";
import useTheme from "@mui/system/useTheme";

const marks = [
  { value: 4, label: "" },
  { value: 8, label: "" },
  { value: 12, label: "" },
  { value: 16, label: "" },
  { value: 20, label: "" },
  { value: 24, label: "" },
];

const Others = () => {
  const theme = useTheme();
  const { updateAppearance, isCollapse, setIsCollapse } = useContext(CustomizerContext);
  const isChecked = isCollapse === "mini_sidebar" ? true : false;
  const updateSetting = (
    payload: Partial<{
      activeTheme: string;
      activeMode: string;
      isCollapse: string;
      isBorderRadius: number;
    }>
  ) => {
    if (payload.isCollapse !== undefined) setIsCollapse(payload.isCollapse);
    updateAppearance(payload);
  };
  return (
    <Stack direction="row" spacing={2} mt={4}>
      <Avatar variant="rounded" sx={{ bgcolor: "grey.100", color: "grey.500", width: 48, height: 48 }}>
        <ViewSidebarTwoToneIcon style={{ color: theme.palette.primary.main }} />
      </Avatar>
      <Box>
        <Typography variant="h6" mb={1}>
          Auto hide sidebar
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          recommended for small screens and mobile devices
        </Typography>
      </Box>
      <Box sx={{ ml: "auto !important" }}>
        <CustomSwitch
          checked={isChecked}
          onChange={() => updateSetting({ isCollapse: isChecked ? "full_sidebar" : "mini_sidebar" })}
        />
      </Box>
    </Stack>
  );
};

export default Others;
