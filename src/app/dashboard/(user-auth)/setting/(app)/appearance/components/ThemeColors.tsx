import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import { IconCheck } from "@tabler/icons-react";
import { LightThemeColors } from "@/utils/theme/LightThemeColors";
import StyledBox from "../StyledBox";
import { useContext } from "react";
import { CustomizerContext } from "@/context/setting/customizerContext";

interface colors {
  id: number;
  bgColor: string;
  disp?: string;
}

const thColors: colors[] = LightThemeColors.map((color, index) => ({
  id: index + 1,
  bgColor: color.palette.primary.main,
  disp: color.name,
}));

const ThemeColors = () => {
  const { updateAppearance, activeTheme, setActiveTheme } = useContext(CustomizerContext);
  const updateSetting = (theme: string) => {
    setActiveTheme(theme);
    updateAppearance({ activeTheme: theme });
  };

  return (
    <Grid container spacing={2}>
      {thColors.map((thcolor) => (
        <Grid
          key={thcolor.id}
          size={{
            xs: 4,
            sm: 1,
          }}
          onClick={() => updateSetting(thcolor.disp ?? "")}
        >
          <Tooltip title={`${thcolor.disp}`} placement="top">
            <StyledBox
              sx={{
                backgroundColor: thcolor.bgColor,
                width: "100%",
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                color: "#fff",
                position: "relative",
                cursor: "pointer",
              }}
            >
              {activeTheme === thcolor.disp ? (
                <IconCheck width={20} style={{ position: "absolute", top: 4, right: 4 }} />
              ) : null}
            </StyledBox>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
};

export default ThemeColors;
