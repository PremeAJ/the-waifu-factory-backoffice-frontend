"use client";
import { Alert, InputAdornment, Stack } from "@mui/material";
import BaseTextField from "@/app/components/forms/theme-elements/BaseTextField";
import BaseButton from "@/app/components/forms/theme-elements/BaseButton";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import { useFormik } from "formik";
import { emailValidator } from "@/utils/validator/yup";
import * as yup from "yup";
import { ResetPasswordForEmailType } from "@/utils/supabase/server";
import Turnstile from "react-turnstile";
import { IconMail } from "@tabler/icons-react";

const validationSchema = yup.object({
  email: emailValidator,
});

export default function AuthForgotPassword() {
  const { t, i18n } = useTranslation();
  const { isLoading, forgotPassword } = useContext(AuthContext);
  const [captchaToken, setCaptchaToken] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const [status, setStatus] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      const payload: ResetPasswordForEmailType = {
        email: data.email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN}/auth/reset-password`,
          captchaToken: captchaToken,
        },
      };
      const { error } = await forgotPassword(payload);
      if (error) {
        switch (error) {
          default:
            setStatus("failed");
            break;
        }
      } else {
        window.location.href = "/auth/login";
      }
    },
  });
  useEffect(() => {
    if (!(formik.isValid && formik.dirty)) {
      setCaptchaToken("");
    }
  }, [formik.isValid, formik.dirty]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack mt={4} spacing={2}>
        <BaseTextField
          name="email"
          formik={formik}
          label="Email Adddress"
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
          label="Forgot Password"
          loading={isLoading}
          type="submit"
          disabled={!captchaToken}
        />
        <BaseButton
          label="Back to Login"
          href="/auth/login"
          variant="outlined"
        />
        {status === "failed" && (
          <Alert variant="filled" severity="error">
            เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง
          </Alert>
        )}
      </Stack>
    </form>
  );
}
