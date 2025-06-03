import { typography } from "@mui/system";
import { color } from "framer-motion";
import { text } from "stream/consumers";

const DarkThemeColors = [
  {
    name: "BLUE_THEME",
    palette: {
      primary: {
        main: "#5D87FF",
        light: "#253662",
        dark: "#4570EA",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#49BEFF",
        light: "#1C455D",
        dark: "#23afdb",
        contrastText: "#ffffff",
      },
      background: {
        default: "#2A3447",
        dark: "#2A3547",
        paper: "#2A3447",
      },
    },
  },
  {
    name: "AQUA_THEME",
    palette: {
      primary: {
        main: "#0074BA",
        light: "#103247",
        dark: "#006DAF",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#47D7BC",
        light: "#0C4339",
        dark: "#39C7AD",
        contrastText: "#ffffff",
      },
    },
  },
  {
    name: "PURPLE_THEME",
    palette: {
      primary: {
        main: "#763EBD",
        light: "#26153C",
        dark: "#6E35B7",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#95CFD5",
        light: "#09454B",
        dark: "#8BC8CE",
        contrastText: "#ffffff",
      },
    },
  },
  {
    name: "GREEN_THEME",
    palette: {
      primary: {
        main: "#0A7EA4",
        light: "#05313F",
        dark: "#06769A",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#CCDA4E",
        light: "#282917",
        dark: "#C3D046",
        contrastText: "#ffffff",
      },
    },
  },
  {
    name: "CYAN_THEME",
    palette: {
      primary: {
        main: "#01C0C8",
        light: "#003638",
        dark: "#00B9C0",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#FB9678",
        light: "#40241C",
        dark: "#F48B6C",
        contrastText: "#ffffff",
      },
    },
  },
  {
    name: "ORANGE_THEME",
    palette: {
      primary: {
        main: "#eb9e37",
        light: "#402E32",
        dark: "#F48162",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#0074BA",
        light: "#082E45",
        dark: "#006FB1",
        contrastText: "#ffffff",
      },
    },
  },
  {
    name: "GRASS_THEME",
    palette: {
      primary: {
        main: "#4CAF50",
        light: "#C8E6C9",
        dark: "#388E3C",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#8BC34A",
        light: "#F1F8E9",
        dark: "#689F38",
        contrastText: "#ffffff",
      },
    },
  },
  {
    name: "PINK_THEME",
    palette: {
      primary: {
        main: "#d81b60",
        light: "#ff8fb5",
        dark: "#880e4f",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ad1457",
        light: "#ff5598",
        dark: "#78002e",
        contrastText: "#ffffff",
      },
    },
  },
  {
    name: "MATCHA_THEME",
    palette: {
      primary: {
        main: "#7CA16C",
        light: "#AFC9A0",
        dark: "#4C6B3C",
        contrastText: "#23281E",
      },
      secondary: {
        main: "#BFA980",
        light: "#8C7A4F",
        dark: "#6B5736",
        contrastText: "#ffffff",
      },
      background: {
        default: "#23281E",
        paper: "#2E3326",
      },
      text: {
        primary: "#ffffff",
        secondary: "#ffffff",
      },
    },
  },
  {
    name: "JINX_THEME",
    palette: {
      primary: {
        main: "#3ad1ff", // ฟ้าสดใส
        light: "#193c47", // ฟ้าอ่อนแบบ dark
        dark: "#1b9fc5", // ฟ้าเข้ม
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ff4fa3", 
        light: "#3a1b2a", 
        dark: "#c2185b",
        contrastText: "#ffffff",
      },
      background: {
        default: "#181c24",
        paper: "#23273a",
      },
      text: {
        primary: "#ffffff",
        secondary: "#b2eaff",
      },
    },
  },
];

export { DarkThemeColors };
