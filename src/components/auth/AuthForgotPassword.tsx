"use client";
import { Alert, InputAdornment, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/common/contexts/AuthContext";
import { useFormik } from "formik";
import { emailValidator } from "@/common/utils/validator/yup";
import * as yup from "yup";
import { ResetPasswordForEmailType } from "@/common/utils/supabase/server";
import Turnstile from "react-turnstile";
import { IconMail } from "@tabler/icons-react";
import BaseButton from "@/common/components/base/BaseButton";
import BaseTextField from "@/common/components/base/BaseTextField";

const validationSchema = yup.object({
  email: emailValidator,
});

type ForgotPasswordStatus = 
  | "idle"
  | "success" 
  | "user_not_found"
  | "over_email_send_rate_limit"
  | "invalid_email"
  | "captcha_failed"
  | "network_error"
  | "unknown_error";
  
const getAlertMessage = (status: ForgotPasswordStatus): string => {
  const messages: Record<ForgotPasswordStatus, string> = {
    idle: "",
    success: "ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบอีเมล",
    user_not_found: "ไม่พบบัญชีผู้ใช้นี้ในระบบ",
    over_email_send_rate_limit: "คุณส่งคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง",
    invalid_email: "อีเมลไม่ถูกต้อง",
    captcha_failed: "การยืนยันตัวตนล้มเหลว กรุณาลองใหม่อีกครั้ง",
    network_error: "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง",
    unknown_error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
  };
  return messages[status];
};

export default function AuthForgotPassword() {
  const { t, i18n } = useTranslation();
  const { isLoading, forgotPassword } = useContext(AuthContext);
  const [captchaToken, setCaptchaToken] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const [status, setStatus] = useState<ForgotPasswordStatus>("idle");

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      try {
        const payload: ResetPasswordForEmailType = {
          email: data.email,
          options: {
            captchaToken: captchaToken,
          },
        };

        const { error } = await forgotPassword(payload);

        if (error) {
          switch (error) {
            case "over_email_send_rate_limit":
              setStatus("over_email_send_rate_limit");
              break;
            case "user_not_found":
              setStatus("user_not_found");
              break;
            case "invalid_email":
              setStatus("invalid_email");
              break;
            case "captcha_failed":
              setStatus("captcha_failed");
              setCaptchaToken("");
              break;
            default:
              setStatus("unknown_error");
          }
          return;
        }

        setStatus("success");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 2000);
      } catch (err) {
        console.error("Forgot password error:", err);
        setStatus("network_error");
      }
    },
  });
  useEffect(() => {
    if (!(formik.isValid && formik.dirty)) {
      setCaptchaToken("");
    }
  }, [formik.isValid, formik.dirty]);

  const renderAlert = () => {
    if (status === "idle") return null;

    return (
      <Alert
        variant="filled"
        severity={status === "success" ? "success" : "error"}
      >
        {getAlertMessage(status)}
      </Alert>
    );
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack mt={4} spacing={2}>
        <BaseTextField
          name="email"
          formik={formik}
          label="Email Address"
          placeholder="กรุณากรอกอีเมลของคุณ"
          startAdornment={
            <InputAdornment position="start">
              <IconMail width={20} />
            </InputAdornment>
          }
        />
        {formik.isValid && formik.dirty && (
          <Turnstile
            sitekey={siteKey}
            theme="light"
            action="forgot-password"
            size="flexible"
            onSuccess={setCaptchaToken}
            language={i18n.language}
          />
        )}
        <BaseButton
          label="ส่งลิงก์รีเซ็ตรหัสผ่าน"
          loading={isLoading}
          type="submit"
          disabled={!captchaToken}
        />
        <BaseButton
          label="กลับไปหน้าเข้าสู่ระบบ"
          href="/auth/login"
          variant="outlined"
        />
        {renderAlert()}
      </Stack>
    </form>
  );
}
