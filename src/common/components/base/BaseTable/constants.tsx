import { Box, Typography } from "@mui/material";

export const TABLE_CONSTANTS = {
  NO_DATA_TEXT: "ไม่พบข้อมูล",
  NO_DATA_SUBTEXT: "ลองเปลี่ยนเงื่อนไขการค้นหา หรือรีเฟรชหน้าใหม่",
  NO_MORE_DATA_TEXT: "ไม่มีข้อมูลเพิ่มเติม",
};

export const COLUMN_WIDTH = {
  EXPAND: 40,
  MOBILE_CONTENT: "90%",
  MOBILE_ACTIONS: "10%",
};

export const renderNoDataMessage = () => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
    <Typography variant="h6" color="text.secondary">
      {TABLE_CONSTANTS.NO_DATA_TEXT}
    </Typography>
    <Typography variant="body2" color="text.disabled">
      {TABLE_CONSTANTS.NO_DATA_SUBTEXT}
    </Typography>
  </Box>
);
