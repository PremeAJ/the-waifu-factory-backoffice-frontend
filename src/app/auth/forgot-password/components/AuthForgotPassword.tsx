"use client";
import { Alert, InputAdornment, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { emailValidator } from "@/common/utils/validator/yup";
import * as yup from "yup";
import { ResetPasswordForEmailType } from "@/common/utils/supabase/server";
import Turnstile from "react-turnstile";
import { IconMail } from "@tabler/icons-react";
import BaseButton from "@/common/components/base/BaseButton";
import BaseTextField from "@/common/components/base/BaseTextField";
import { useAuth } from "@/common/contexts/AuthContext";
import { ForgotPasswordPayload } from "@/common/contexts/AuthContext/interfaces/interface";

const validationSchema = yup.object({
  email: emailValidator,
});

export default function AuthForgotPassword() {
  const { t, i18n } = useTranslation();
  const [captchaToken, setCaptchaToken] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const { forgotPassword } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      const payload: ForgotPasswordPayload = {
        email: data.email,
      };
      const response = await forgotPassword(payload);
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
      <Alert variant="filled" severity={status === "success" ? "success" : "error"}>
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
          <Turnstile sitekey={siteKey} theme="light" action="forgot-password" size="flexible" onSuccess={setCaptchaToken} language={i18n.language} />
        )}
        <BaseButton label="ส่งลิงก์รีเซ็ตรหัสผ่าน" type="submit" disabled={!captchaToken} />
        <BaseButton label="กลับไปหน้าเข้าสู่ระบบ" href="/auth/login" variant="outlined" />
        {renderAlert()}
      </Stack>
    </form>
  );
}
