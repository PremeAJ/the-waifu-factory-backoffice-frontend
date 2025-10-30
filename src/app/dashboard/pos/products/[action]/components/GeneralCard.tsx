"use client";
import { BaseTabPanel, BaseTabs, BaseTextField, BaseTiptap } from "@/common/components/base";
import { Grid } from "@mui/material";
import { Typography, Box } from "@mui/material";
import { useState } from "react";
import { languageTabs } from "@/common/contexts";

const GeneralCard = ({ formik }: { formik: any }) => {
  const [tab, setTab] = useState<number>(0);
  const handleChange = (_: React.SyntheticEvent, newVal: number) => setTab(newVal);

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">ทั่วไป</Typography>
        <BaseTabs value={tab} onChange={handleChange} tabs={languageTabs} />
      </Box>

      <Grid container mt={3}>
        <Grid size={{ xs: 12 }}>
          <BaseTabPanel value={tab} index={0}>
            <BaseTextField formik={formik} fullWidth label="ชื่อสินค้า" lang="th" name="nameTh" placeholder="ชื่อสินค้า" required />
          </BaseTabPanel>

          <BaseTabPanel value={tab} index={1}>
            <BaseTextField formik={formik} fullWidth label="ชื่อสินค้า" lang="en" name="nameEn" placeholder="ชื่อสินค้า" />
          </BaseTabPanel>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <BaseTabPanel value={tab} index={0}>
            <Box key="desc_th">
              <BaseTiptap formik={formik} name="descriptionTh" label="รายละเอียด" placeholder="รายละเอียด" lang="th" required/>
            </Box>
          </BaseTabPanel>

          <BaseTabPanel value={tab} index={1}>
            <Box key="desc_en">
              <BaseTiptap formik={formik} name="descriptionEn" label="รายละเอียด" placeholder="รายละเอียด" lang="en" />
            </Box>
          </BaseTabPanel>
        </Grid>

      </Grid>
    </Box>
  );
};

export default GeneralCard;
