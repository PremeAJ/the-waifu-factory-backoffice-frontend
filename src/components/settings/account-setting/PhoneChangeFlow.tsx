// src/components/settings/account-setting/PhoneChangeFlow.tsx
import React, { useState, useContext } from "react";
import { Box, InputAdornment, Typography, useMediaQuery, useTheme } from "@mui/material";
import { IconAlertTriangle, IconInfoCircle, IconDeviceMobile, IconCheck } from "@tabler/icons-react";
import { UserContext } from "@/context/UserContext";
import BaseTextField from "../../forms/theme-elements/BaseTextField";
import TransitionDialog from "../../ui-components/dialog/TransitionDialog";
import { phoneRegex } from "@/utils/validator/regex";

interface PhoneChangeFlowProps {
  open: boolean;
  onClose: () => void;
  currentPhone?: string;
}

const PhoneChangeFlow: React.FC<PhoneChangeFlowProps> = ({ open, onClose, currentPhone }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const { updateUserPhone, verifyPhoneOtp } = useContext(UserContext);

  const [step, setStep] = useState<"input" | "verify">("input");
  const [newPhone, setNewPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleSendOtp = async () => {
    if (!newPhone) {
      setPhoneError("กรุณากรอกหมายเลขโทรศัพท์");
      return;
    }

    if (!phoneRegex.test(newPhone)) {
      setPhoneError("รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง");
      return;
    }

    if (newPhone === currentPhone) {
      setPhoneError("หมายเลขโทรศัพท์ใหม่ต้องไม่เหมือนกับหมายเลขเดิม");
      return;
    }

    setLoading(true);
    setPhoneError("");

    try {
      const { data, error } = await updateUserPhone(newPhone);

      if (error) {
        setPhoneError("เกิดข้อผิดพลาดในการส่ง OTP กรุณาลองใหม่อีกครั้ง");
      } else {
        setStep("verify");
      }
    } catch (error) {
      setPhoneError("เกิดข้อผิดพลาดในการส่ง OTP กรุณาลองใหม่อีกครั้ง");
    }

    setLoading(false);
  };

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    if (!otpCode) {
      setOtpError("กรุณากรอกรหัส OTP");
      return;
    }

    if (otpCode.length !== 6) {
      setOtpError("รหัส OTP ต้องมี 6 หลัก");
      return;
    }

    setLoading(true);
    setOtpError("");

    try {
      const { data, error } = await verifyPhoneOtp(newPhone, otpCode);

      if (error) {
        setOtpError("รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
      } else {
        // Success - close dialog and refresh user data
        handleClose();
        // Optional: Show success message
      }
    } catch (error) {
      setOtpError("เกิดข้อผิดพลาดในการยืนยัน OTP กรุณาลองใหม่อีกครั้ง");
    }

    setLoading(false);
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    await handleSendOtp();
  };

  // Handle close and reset
  const handleClose = () => {
    setStep("input");
    setNewPhone("");
    setOtpCode("");
    setPhoneError("");
    setOtpError("");
    onClose();
  };

  return (
    <>
      {/* Dialog สำหรับกรอกหมายเลขโทรศัพท์ใหม่ */}
      <TransitionDialog
        open={open && step === "input"}
        title={currentPhone ? "เปลี่ยนหมายเลขโทรศัพท์" : "เพิ่มหมายเลขโทรศัพท์"}
        content={
          <Box>
            <Typography variant="body2" color="textSecondary" mb={2}>
              {currentPhone 
                ? "กรุณากรอกหมายเลขโทรศัพท์ใหม่ที่ต้องการเปลี่ยน ระบบจะส่งรหัส OTP ไปยังหมายเลขใหม่"
                : "กรุณากรอกหมายเลขโทรศัพท์ของคุณ ระบบจะส่งรหัส OTP เพื่อยืนยัน"
              }
            </Typography>
            
            {currentPhone && (
              <Box sx={{ backgroundColor: "#f8f9fa", p: 2, borderRadius: 2, mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  หมายเลขปัจจุบัน: <strong>{currentPhone}</strong>
                </Typography>
              </Box>
            )}

            <BaseTextField
              name="newPhone"
              label={currentPhone ? "หมายเลขโทรศัพท์ใหม่" : "หมายเลขโทรศัพท์"}
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              error={!!phoneError}
              helperText={phoneError}
              fullWidth
              placeholder={currentPhone ? "กรุณากรอกหมายเลขโทรศัพท์ใหม่" : "กรุณากรอกหมายเลขโทรศัพท์"}
              startAdornment={
                <InputAdornment position="start">
                  <IconDeviceMobile width={20} />
                </InputAdornment>
              }
            />
          </Box>
        }
        confirmText="ส่งรหัส OTP"
        cancelText="ยกเลิก"
        onConfirm={handleSendOtp}
        onClose={handleClose}
        loading={loading}
        fullScreen={isMobile}
      />

      {/* Dialog สำหรับยืนยัน OTP */}
      <TransitionDialog
        open={open && step === "verify"}
        icon="/images/breadcrumb/otpSv.png"
        iconSize={100}
        title="ยืนยันรหัส OTP"
        content={
          <Box textAlign="center">
            <Typography variant="body1" mb={2}>
              เราได้ส่งรหัส OTP ไปยัง
            </Typography>
            
            <Box sx={{ backgroundColor: "#f8f9fa", p: 2, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {newPhone}
              </Typography>
            </Box>

            <BaseTextField
              name="otpCode"
              label="รหัส OTP (6 หลัก)"
              type="tel"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              error={!!otpError}
              helperText={otpError}
              fullWidth
              placeholder="123456"
              inputProps={{
                maxLength: 6,
                style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em' }
              }}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                ไม่ได้รับรหัส OTP?{" "}
                <span 
                  style={{ color: theme.palette.primary.main, cursor: "pointer", textDecoration: "underline" }}
                  onClick={handleResendOtp}
                >
                  ส่งใหม่อีกครั้ง
                </span>
              </Typography>
            </Box>

            <Box sx={{ backgroundColor: "#fff3cd", p: 2, borderRadius: 2, mt: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                <IconAlertTriangle size={18} color="#856404" style={{ marginRight: 8 }} />
                <Typography variant="body2" fontWeight="bold" color="#856404">
                  หมายเหตุ
                </Typography>
              </Box>
              <Typography variant="body2" color="#856404">
                รหัส OTP จะหมดอายุใน 5 นาที
              </Typography>
            </Box>
          </Box>
        }
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        onConfirm={handleVerifyOtp}
        onClose={handleClose}
        loading={loading}
        fullScreen={isMobile}
      />
    </>
  );
};

export default PhoneChangeFlow;