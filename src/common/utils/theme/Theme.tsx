import _ from "lodash";
import { baseDarkTheme, baselightTheme } from "./DefaultColors";
import { createTheme } from "@mui/material/styles";
import { DarkThemeColors } from "./DarkThemeColors";
import { LightThemeColors } from "./LightThemeColors";
import { shadows, darkshadows } from "./Shadows";
import { useProfile } from "@/common/contexts/ProfileContext";
import * as locales from "@mui/material/locale";
import components from "./Components";
import typography from "./Typography";

export const BuildTheme = (config: any = {}) => {
  const { appearance } = useProfile();
  const { activeMode, isBorderRadius } = appearance || {};
  const themeOptions = LightThemeColors.find((theme) => theme.name === config.theme);
  const darkthemeOptions = DarkThemeColors.find((theme) => theme.name === config.theme);
  const defaultTheme = activeMode === "dark" ? baseDarkTheme : baselightTheme;
  const defaultShadow = activeMode === "dark" ? darkshadows : shadows;
  const themeSelect = activeMode === "dark" ? darkthemeOptions : themeOptions;
  const baseMode = {
    palette: {
      mode: activeMode,
    },
    shape: {
      borderRadius: isBorderRadius,
    },
    shadows: defaultShadow,
    typography: typography,
  };
  const theme = createTheme(
    _.merge({}, baseMode, defaultTheme, locales, themeSelect, {
      direction: config.direction,
    })
  );
  theme.components = components(theme);

  return theme;
};

const ThemeSettings = () => {
  const { appearance } = useProfile();
  const { activeTheme } = appearance || {};
  const theme = BuildTheme({
    theme: activeTheme,
  });

  return theme;
};

export { ThemeSettings };
