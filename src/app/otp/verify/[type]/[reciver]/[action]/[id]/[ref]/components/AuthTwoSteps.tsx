"use client";
import { Box, Typography } from "@mui/material";
import { OtpProvider } from "@/common/contexts/OtpContext";
import { Stack } from "@mui/system";
import { useParams } from "next/navigation";
import BaseButton from "@/common/components/base/BaseButton";
import BaseLinkButton from "@/common/components/base/BaseLinkButton";
import BaseOTP from "@/common/components/base/BaseOTP";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";
import React, { useState } from "react";

const AuthTwoSteps = () => {
  const params = useParams();
  const { type, reciver, action, id, ref } = params;
  const [otp, setOtp] = useState("");

  return (
    <OtpProvider>
      <Box mt={4}>
        <Stack mb={3}>
          <CustomFormLabel htmlFor="code">กรอกรหัส OTP 6 หลัก</CustomFormLabel>
          <BaseOTP value={otp} onChange={setOtp} />
        </Stack>
        <BaseButton onClick={() => console.log(otp)} variant="contained" label="ยืนยัน" />
        <Stack direction="row" spacing={1} mt={3}>
          <Typography color="textSecondary" variant="h6" fontWeight="400">
            ไม่ได้รับรหัส OTP?
          </Typography>
          <BaseLinkButton onClick={() => console.log()} label="ส่งอีกครั้ง" />
        </Stack>
      </Box>
    </OtpProvider>
  );
};

export default AuthTwoSteps;
