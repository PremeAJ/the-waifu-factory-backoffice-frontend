import { Stack } from "@mui/system";
import WbSunnyTwoToneIcon from "@mui/icons-material/WbSunnyTwoTone";
import DarkModeTwoToneIcon from "@mui/icons-material/DarkModeTwoTone";
import StyledBox from "../StyledBox";
import { useProfile } from "@/common/contexts/ProfileContext";
import { ActiveMode } from "@/common/contexts/ProfileContext/interfaces/interface";

const ThemeMode = () => {
  const { updateAppearance } = useProfile();
  const { appearance } = useProfile();
  const { activeMode } = appearance || {};
  const updateSetting = (mode: ActiveMode) => {
    updateAppearance({ activeMode: mode });
  };

  return (
    <>
      <Stack direction={"row"} gap={2} my={2}>
        <StyledBox onClick={() => updateSetting("light")} display="flex" gap={1} selected={activeMode === "light"}>
          <WbSunnyTwoToneIcon color={activeMode === "light" ? "primary" : "inherit"} />
          Light
        </StyledBox>
        <StyledBox onClick={() => updateSetting("dark")} display="flex" gap={1} selected={activeMode === "dark"}>
          <DarkModeTwoToneIcon color={activeMode === "dark" ? "primary" : "inherit"} />
          Dark
        </StyledBox>
      </Stack>
    </>
  );
};

export default ThemeMode;
