import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import WbSunnyTwoToneIcon from "@mui/icons-material/WbSunnyTwoTone";
import DarkModeTwoToneIcon from "@mui/icons-material/DarkModeTwoTone";
import StyledBox from "../StyledBox";
import { useContext } from "react";
import { CustomizerContext } from "@/app/context/setting/customizerContext";

const ThemeMode = () => {
  const { updateAppearance, activeMode, setActiveMode } = useContext(CustomizerContext);
  const updateSetting = (mode: string) => {
    setActiveMode(mode);
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
