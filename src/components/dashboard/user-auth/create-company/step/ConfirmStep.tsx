import React from "react";
import { Box, Typography } from "@mui/material";
import BaseCheckBox from "@/components/base/BaseCheckBox";

const ConfirmStep = ({ formik }: any) => (
  <Box pt={3}>
    <Typography variant="h6" mb={2}>
      ตรวจสอบข้อมูลก่อนยืนยัน
    </Typography>
    <Typography variant="body2">
      <b>ชื่อบริษัท:</b> {formik.values.companyName}
      <br />
      <b>อีเมลบริษัท:</b> {formik.values.companyEmail}
      <br />
      <b>ที่อยู่บริษัท:</b> {formik.values.companyAddress}
      <br />
      <b>ชื่อผู้ติดต่อ:</b> {formik.values.contactName}
      <br />
      <b>อีเมลผู้ติดต่อ:</b> {formik.values.contactEmail}
      <br />
      <b>เบอร์โทรศัพท์:</b> {formik.values.contactPhone}
    </Typography>
    <BaseCheckBox name="agree" label="ยอมรับเงื่อนไขการใช้งาน" formik={formik} />
  </Box>
);

export default ConfirmStep;