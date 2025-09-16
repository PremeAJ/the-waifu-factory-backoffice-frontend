"use client";
import { emailValidator } from "@/common/utils/validator/yup";
import { ForgotPasswordPayload } from "@/common/contexts/AuthContext/interfaces/interface";
import { genOtpUrl } from "@/common/utils/otpUrl";
import { IconMail } from "@tabler/icons-react";
import { InputAdornment, Stack } from "@mui/material";
import { PageUrl } from "@/common/constants/pageUrl";
import { useAuth } from "@/common/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useEncrypt } from "@/common/contexts/EncryptContext";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import BaseButton from "@/common/components/base/BaseButton";
import BaseTextField from "@/common/components/base/BaseTextField";
import Turnstile from "react-turnstile";
import { useDialog } from "@/common/contexts/DialogContext";

const validationSchema = yup.object({
  email: emailValidator,
});

export default function AuthForgotPassword() {
  const [captchaToken, setCaptchaToken] = useState("");
  const { encrypt } = useEncrypt();
  const { forgotPassword, loading } = useAuth();
  const { showError } = useDialog();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      const payload: ForgotPasswordPayload = {
        email: encrypt(data.email),
      };
      const response = await forgotPassword(payload);
      if (response.error) {
        showError({ message: response.message, title: "เกิดข้อผิดพลาด" });
      } else {
        const { id, otpRef, otpType, email, expiresIn } = response.data;
        const url = genOtpUrl({ type: "email", reciver: email, otpType, id, otpRef, expiresIn });
        router.replace(url);
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
        <BaseButton label="ส่งลิงก์รีเซ็ตรหัสผ่าน" type="submit" disabled={!captchaToken} loading={loading} />
        <BaseButton label="กลับไปหน้าเข้าสู่ระบบ" href={PageUrl.AUTH_SIGN_IN} variant="outlined" loading={loading} />
      </Stack>
    </form>
  );
}
