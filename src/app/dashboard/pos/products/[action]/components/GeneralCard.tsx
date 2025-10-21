"use client";
import { Grid } from "@mui/material";
import { Typography, Box } from "@mui/material";
import BaseTabs, { BaseTabPanel } from "@/common/components/base/BaseTabs";
import Avatar from "@mui/material/Avatar";
import BaseTextField from "@/common/components/base/BaseTextField";
import BaseTiptap from "@/common/components/base/BaseTipTap/BaseTiptap";
import React from "react";
import { OptionType } from "@/common/components/base/BaseDropdown";

const GeneralCard = ({ formik }: { formik: any }) => {
  const [tab, setTab] = React.useState<number>(0);
  const handleChange = (_: React.SyntheticEvent, newVal: number) => setTab(newVal);

  const tabs = [
    { label: "ไทย", icon: <Avatar src="/images/flag/icon-flag-th.svg" alt="TH" sx={{ width: 22, height: 22 }} /> },
    { label: "อังกฤษ", icon: <Avatar src="/images/flag/icon-flag-en.svg" alt="EN" sx={{ width: 22, height: 22 }} /> },
  ];

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">ทั่วไป</Typography>
        <BaseTabs value={tab} onChange={handleChange} tabs={tabs} />
      </Box>

      <Grid container mt={3}>
        <Grid size={{ xs: 12 }}>
          <BaseTabPanel value={tab} index={0}>
            <BaseTextField formik={formik} fullWidth label="ชื่อสินค้า" lang="th" name="p_name_th" placeholder="ชื่อสินค้า" required />
          </BaseTabPanel>

          <BaseTabPanel value={tab} index={1}>
            <BaseTextField formik={formik} fullWidth label="ชื่อสินค้า" lang="en" name="p_name_en" placeholder="ชื่อสินค้า" />
          </BaseTabPanel>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <BaseTabPanel value={tab} index={0}>
            <Box key="desc_th">
              <BaseTiptap formik={formik} name="p_description_th" label="รายละเอียด" placeholder="รายละเอียด" lang="th" />
            </Box>
          </BaseTabPanel>

          <BaseTabPanel value={tab} index={1}>
            <Box key="desc_en">
              <BaseTiptap formik={formik} name="p_description_en" label="รายละเอียด" placeholder="รายละเอียด" lang="en" />
            </Box>
          </BaseTabPanel>
        </Grid>

      </Grid>
    </Box>
  );
};

export default GeneralCard;
