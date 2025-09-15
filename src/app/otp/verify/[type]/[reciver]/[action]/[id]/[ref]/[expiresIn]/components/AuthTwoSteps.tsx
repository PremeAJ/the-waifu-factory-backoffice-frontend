"use client";
import { Box, Typography } from "@mui/material";
import { genOtpUrl } from "@/common/utils/otpUrl";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { useOtp, OtpType } from "@/common/contexts/OtpContext";
import { useParams, useRouter } from "next/navigation";
import BaseButton from "@/common/components/base/BaseButton";
import BaseLinkButton from "@/common/components/base/BaseLinkButton";
import BaseOTP from "@/common/components/base/BaseOTP";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";
import { useError } from "@/common/contexts/ErrorContext";

const AuthTwoSteps = () => {
  const params = useParams();
  const router = useRouter();
  const { showError } = useError();
  const [errorText, setErrorText] = useState("");
  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const { type, reciver, action, id, ref, expiresIn } = params;
  const { verifyOtp, resendOtp, loading } = useOtp();
  const onFocusVerifyOtp = async () => {
    const response = await verifyOtp({
      id: id?.toString() || "",
      type: action?.toString() || "",
      ref: ref?.toString() || "",
      otp: otp,
    });
    if (response.statusCode !== 200) {
      setErrorText(response.message || "เกิดข้อผิดพลาด");
    } else {
      setErrorText("");
      switch (action) {
        case OtpType.sign_up:
          router.replace("/auth/sign-in");
          break;
        case OtpType.forgot_password: {
          const url = `/auth/password/reset/${encodeURIComponent(id?.toString() || "")}`;
          const params = new URLSearchParams({ code: response.data || "" });
          router.replace(`${url}?${params.toString()}`);
          break;
        }
        default:
          router.replace("/auth/sign-in");
          break;
      }
    }
  };

  const handleResend = async () => {
    const response = await resendOtp({
      id: id?.toString() || "",
      type: action?.toString() || "",
      ref: ref?.toString() || "",
    });

    if (response.statusCode !== 200) {
      setErrorText(response.message || "เกิดข้อผิดพลาด");
    } else {
      const { expiresIn, otpRef } = response.data || {};
      const url = genOtpUrl({
        type: type?.toString() || "",
        reciver: reciver?.toString() || "",
        otpType: action?.toString() || "",
        id: id?.toString() || "",
        otpRef: otpRef?.toString() || "",
        expiresIn: expiresIn || 0,
      });
      router.replace(url);
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      onFocusVerifyOtp();
    } else {
      setErrorText("");
    }
  }, [otp]);

  useEffect(() => {
    if (expiresIn) {
      const getSecondsLeft = () => {
        const now = Date.now();
        const expireTime = Number(expiresIn);
        return Math.max(Math.floor((expireTime - now) / 1000), 0);
      };
      setSecondsLeft(getSecondsLeft());
      const interval = setInterval(() => {
        setSecondsLeft(getSecondsLeft());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [expiresIn]);

  if (!Object.values(OtpType).includes(action?.toString() as OtpType)) {
    showError("ประเภท OTP ไม่ถูกต้อง", "เกิดข้อผิดพลาด");
    return null;
  }

  return (
    <Box mt={4}>
      <Stack mb={3}>
        <CustomFormLabel htmlFor="code">กรอกรหัส OTP 6 หลัก</CustomFormLabel>
        <BaseOTP value={otp} onChange={setOtp} error={!!errorText} />
        {errorText && (
          <Typography color="error" variant="body2" mt={1}>
            {errorText}
          </Typography>
        )}
      </Stack>
      <BaseButton onClick={() => console.log(otp)} variant="contained" label="ยืนยัน" loading={loading} />
      <Stack direction="row" spacing={1} mt={3} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography color="textSecondary" variant="h6" fontWeight="400">
            ไม่ได้รับรหัส OTP?
          </Typography>
          <BaseLinkButton onClick={handleResend} label="ส่งอีกครั้ง" />
        </Stack>
        {typeof secondsLeft === "number" && (
          <Typography variant="body2" color={secondsLeft === 0 ? "error" : "textSecondary"}>
            {secondsLeft > 0
              ? `รหัสหมดอายุใน ${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60).toString().padStart(2, "0")}`
              : "รหัสหมดอายุ กรุณาขอใหม่"}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default AuthTwoSteps;
