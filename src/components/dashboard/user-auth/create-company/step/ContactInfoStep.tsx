import React from "react";
import { Grid } from "@mui/material";
import BaseTextField from "@/components/base/BaseTextField";

const ContactInfoStep = ({ formik }: any) => (
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 6 }}>
      <BaseTextField name="contactName" label="ชื่อผู้ติดต่อ" formik={formik} required fullWidth placeholder="กรอกชื่อผู้ติดต่อ" />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <BaseTextField
        name="contactEmail"
        label="อีเมลผู้ติดต่อ"
        type="email"
        formik={formik}
        required
        fullWidth
        placeholder="กรอกอีเมลผู้ติดต่อ"
      />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <BaseTextField name="contactPhone" label="เบอร์โทรศัพท์" formik={formik} required fullWidth placeholder="กรอกเบอร์โทรศัพท์" />
    </Grid>
  </Grid>
);

export default ContactInfoStep;