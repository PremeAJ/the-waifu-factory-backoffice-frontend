"use client";
import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { Typography, Tabs, Tab } from "@mui/material";
import { Grid } from "@mui/material";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/components/forms/theme-elements/CustomTextField";

import BaseTiptap from "@/common/components/base/BaseTiptap";

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

const GeneralCard = () => {
  const [tab, setTab] = React.useState<number>(0);
  const [descTh, setDescTh] = React.useState<string>("");
  const [descEn, setDescEn] = React.useState<string>("");

  const handleChange = (_: React.SyntheticEvent, newVal: number) => setTab(newVal);

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">General</Typography>
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
        <Grid display="flex" alignItems="center" size={12}>
          <CustomFormLabel htmlFor="p_name" sx={{ mt: 0 }}>
            Product Name{" "}
            <Typography color="error.main" component="span">
              *
            </Typography>
          </CustomFormLabel>
        </Grid>

        <Grid size={12}>
          <TabPanel value={tab} index={0}>
            <CustomTextField id="p_name_th" placeholder="Product Name (TH)" fullWidth />
            <Typography variant="body2">A product name is required and recommended to be unique.</Typography>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <CustomTextField id="p_name_en" placeholder="Product Name (EN)" fullWidth />
            <Typography variant="body2">A product name is required and recommended to be unique.</Typography>
          </TabPanel>
        </Grid>

        <Grid display="flex" alignItems="center" size={12} mt={2}>
          <CustomFormLabel>Description</CustomFormLabel>
        </Grid>

        <Grid size={12}>
          <TabPanel value={tab} index={0}>
            <Box key="desc_th">
              <BaseTiptap
                name="p_description_th"
                value={descTh}
                onChange={setDescTh}
                placeholder="Description (TH)"
                // optional: pass tooltip/label/required/loading as needed
              />
            </Box>

            <Typography variant="body2">Set a description to the product for better visibility.</Typography>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Box key="desc_en">
              <BaseTiptap
                name="p_description_en"
                value={descEn}
                onChange={setDescEn}
                placeholder="Description (EN)"
              />
            </Box>

            <Typography variant="body2">Set a description to the product for better visibility.</Typography>
          </TabPanel>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeneralCard;
