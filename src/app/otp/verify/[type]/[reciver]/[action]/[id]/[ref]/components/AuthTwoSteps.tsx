"use client";
import { Box, Typography } from "@mui/material";
import { OtpProvider } from "@/common/contexts/OtpContext";
import { Stack } from "@mui/system";
import BaseButton from "@/common/components/base/BaseButton";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/components/forms/theme-elements/CustomTextField";
import BaseLinkButton from "@/common/components/base/BaseLinkButton";

const AuthTwoSteps = () => (
  <>
    <OtpProvider>
      <Box mt={4}>
        <Stack mb={3}>
          <CustomFormLabel htmlFor="code">กรอกรหัส OTP 6 หลัก</CustomFormLabel>
          <Stack spacing={2} direction="row">
            <CustomTextField id="code" variant="outlined" fullWidth />
            <CustomTextField id="code" variant="outlined" fullWidth />
            <CustomTextField id="code" variant="outlined" fullWidth />
            <CustomTextField id="code" variant="outlined" fullWidth />
            <CustomTextField id="code" variant="outlined" fullWidth />
            <CustomTextField id="code" variant="outlined" fullWidth />
          </Stack>
        </Stack>
        <BaseButton onClick={() => console.log()} variant="contained" label="ยืนยัน" />
        <Stack direction="row" spacing={1} mt={3}>
          <Typography color="textSecondary" variant="h6" fontWeight="400">
            ไม่ได้รับรหัส OTP?
          </Typography>
          <BaseLinkButton onClick={() => console.log()} label="ส่งอีกครั้ง" />
        </Stack>
      </Box>
    </OtpProvider>
  </>
);

export default AuthTwoSteps;
