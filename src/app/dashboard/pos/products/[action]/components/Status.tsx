"use client";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Grid, Typography, MenuItem, Avatar } from "@mui/material";
import CustomSelect from "@/components/forms/theme-elements/CustomSelect";

interface StatusCardProps {
  formik?: any;
  name?: string; // optional custom field name
}

const StatusCard: React.FC<StatusCardProps> = ({ formik, name = "status" }) => {
  const initial = formik?.values?.[name] ?? 0;
  const [status, setStatus] = useState<number>(initial);

  useEffect(() => {
    const next = formik?.values?.[name];
    if (typeof next === "number" && next !== status) {
      setStatus(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik?.values?.[name]]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const v = Number(event.target.value);
    setStatus(v);
    if (formik) formik.setFieldValue(name, v);
  };

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">สถานะ</Typography>

        <Avatar
          sx={{
            backgroundColor:
              status === 0
                ? "primary.main"
                : status === 1
                ? "error.main"
                : status === 2
                ? "secondary.main"
                : status === 3
                ? "warning.main"
                : "error.main",
            "& svg": { display: "none" },
            width: 15,
            height: 15,
          }}
        />
      </Box>
      <Grid container mt={3}>
        <Grid size={{ xs: 12 }}>
          <CustomSelect value={status} onChange={handleChange} fullWidth>
            <MenuItem value={0}>เผยแพร่</MenuItem>
            <MenuItem value={1}>ร่าง</MenuItem>
            <MenuItem value={2}>กำหนดเวลา</MenuItem>
            <MenuItem value={3}>ไม่ใช้งาน</MenuItem>
          </CustomSelect>
          <Typography variant="body2">Set the product status.</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatusCard;
