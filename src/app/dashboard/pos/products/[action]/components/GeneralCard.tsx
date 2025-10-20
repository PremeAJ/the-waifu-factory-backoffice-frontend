"use client";
import { Grid } from "@mui/material";
import { Typography, Tabs, Tab } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import BaseTextField from "@/common/components/base/BaseTextField";
import BaseTiptap from "@/common/components/base/BaseTipTap/BaseTiptap";
import Box from "@mui/material/Box";
import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`general-tabpanel-${index}`} aria-labelledby={`general-tab-${index}`} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `general-tab-${index}`,
    "aria-controls": `general-tabpanel-${index}`,
  };
}

// Presentational GeneralCard that receives formik from parent
const GeneralCard = ({ formik }: { formik: any }) => {
  const [tab, setTab] = React.useState<number>(0);
  const handleChange = (_: React.SyntheticEvent, newVal: number) => setTab(newVal);

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">ทั่วไป</Typography>
        <Tabs value={tab} onChange={handleChange} aria-label="language tabs">
          <Tab
            icon={<Avatar src="/images/flag/icon-flag-th.svg" alt="TH" sx={{ width: 22, height: 22 }} />}
            iconPosition="start"
            label="ไทย"
            {...a11yProps(0)}
          />
          <Tab
            icon={<Avatar src="/images/flag/icon-flag-en.svg" alt="EN" sx={{ width: 22, height: 22 }} />}
            iconPosition="start"
            label="อังกฤษ"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>

      <Grid container mt={3}>
        <Grid size={{ xs: 12 }}>
          <TabPanel value={tab} index={0}>
            <BaseTextField formik={formik} fullWidth label="ชื่อสินค้า" lang="th" name="p_name_th" placeholder="ชื่อสินค้า" required />
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <BaseTextField formik={formik} fullWidth label="ชื่อสินค้า" lang="en" name="p_name_en" placeholder="ชื่อสินค้า" />
          </TabPanel>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TabPanel value={tab} index={0}>
            <Box key="desc_th">
              <BaseTiptap formik={formik} name="p_description_th" label="รายละเอียด" placeholder="รายละเอียด" lang="th"/>
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Box key="desc_en">
              <BaseTiptap formik={formik} name="p_description_en" label="รายละเอียด" placeholder="รายละเอียด" lang="en"/>
            </Box>
          </TabPanel>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeneralCard;
