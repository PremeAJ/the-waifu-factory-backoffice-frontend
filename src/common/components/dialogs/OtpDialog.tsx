"use client";

import { Box, Typography, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useOtp, OtpType } from "@/common/contexts/OtpContext";
import { useEncrypt } from "@/common/contexts/EncryptContext";
import { genOtpUrl } from "@/common/utils/otpUrl";
import BaseDialog from "@/common/components/base/BaseDialog";
import BaseOTP from "@/common/components/base/BaseOTP";
import BaseButton from "@/common/components/base/BaseButton";
import BaseLinkButton from "@/common/components/base/BaseLinkButton";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";

// Interface สำหรับ Props ที่จะรับเข้ามา
export interface OtpDialogParams {
  type: string;
  reciver: string;
  action: OtpType;
  id: string;
  ref: string;
  expiresIn: number;
}

interface OtpDialogProps {
  open: boolean;
  onClose: () => void;
  params: OtpDialogParams | null;
  onSuccess: (data: any) => void; // Callback เมื่อยืนยันสำเร็จ
}

const OtpDialog: React.FC<OtpDialogProps> = ({ open, onClose, params, onSuccess }) => {
  const { verifyOtp, resendOtp, loading } = useOtp();
  const { decrypt, censorEmail } = useEncrypt();

  const [otp, setOtp] = useState("");
  const [errorText, setErrorText] = useState("");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [currentParams, setCurrentParams] = useState(params);

  // อัปเดต state ภายในเมื่อ props.params เปลี่ยน
  useEffect(() => {
    if (open && params) {
      setCurrentParams(params);
      setOtp("");
      setErrorText("");
    }
  }, [open, params]);

  // Countdown Timer
  useEffect(() => {
    if (open && currentParams?.expiresIn) {
      const getSecondsLeft = () => {
        const now = Date.now();
        const expireTime = Number(currentParams.expiresIn);
        return Math.max(Math.floor((expireTime - now) / 1000), 0);
      };
      setSecondsLeft(getSecondsLeft());
      const interval = setInterval(() => {
        const timeLeft = getSecondsLeft();
        if (timeLeft === 0) {
          clearInterval(interval);
        }
        setSecondsLeft(timeLeft);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [open, currentParams]);

  // ตรวจสอบ OTP อัตโนมัติเมื่อครบ 6 หลัก
  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOtp();
    } else {
      setErrorText("");
    }
  }, [otp]);

  const handleVerifyOtp = async () => {
    if (!currentParams) return;
    const response = await verifyOtp({
      id: currentParams.id,
      type: currentParams.action,
      ref: currentParams.ref,
      otp: otp,
    });

    if (response.statusCode !== 200) {
      setErrorText(response.message || "เกิดข้อผิดพลาด");
    } else {
      setErrorText("");
      onSuccess(response.data); // เรียก callback เมื่อสำเร็จ
      onClose();
    }
  };

  const handleResend = async () => {
    if (!currentParams) return;
    const response = await resendOtp({
      id: currentParams.id,
      type: currentParams.action,
      ref: currentParams.ref,
    });

    if (response.statusCode !== 200) {
      setErrorText(response.message || "เกิดข้อผิดพลาด");
    } else {
      // อัปเดต params ด้วยข้อมูลใหม่ที่ได้จากการ resend
      const { expiresIn, otpRef } = response.data || {};
      setCurrentParams((prev) =>
        prev
          ? {
              ...prev,
              ref: otpRef || prev.ref,
              expiresIn: expiresIn || prev.expiresIn,
            }
          : null
      );
      setOtp(""); // เคลียร์ OTP เดิม
    }
  };

  const decryptedReciver = decrypt(currentParams?.reciver || "") || "";

  const content = (
    <Box>
      <Typography variant="subtitle1" color="textSecondary" mt={2} mb={1}>
        เราได้ส่งรหัสยืนยันไปยัง {currentParams?.type} ของคุณ กรุณากรอกรหัสที่ได้รับ
      </Typography>
      <Typography variant="subtitle1" fontWeight="700" mb={1}>
        {censorEmail(decryptedReciver)}
      </Typography>
      <Box >
        <Stack mb={3}>
          <CustomFormLabel htmlFor="code">กรอกรหัส OTP 6 หลัก</CustomFormLabel>
          <BaseOTP value={otp} onChange={setOtp} error={!!errorText} />
          {errorText && (
            <Typography color="error" variant="body2" mt={1}>
              {errorText}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" spacing={1} mt={3} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography color="textSecondary" variant="h6" fontWeight="400">
              ไม่ได้รับรหัส OTP?
            </Typography>
            <BaseLinkButton onClick={handleResend} label="ส่งอีกครั้ง"  />
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
    </Box>
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="ยืนยันตัวตน"
      content={content}
      confirmText="ยืนยัน"
      onConfirm={handleVerifyOtp}
      loading={loading}
    //   disabled={otp.length !== 6}
    />
  );
};

export default OtpDialog;