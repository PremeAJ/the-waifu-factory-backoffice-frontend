"use client";
import { Alert, InputAdornment, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import { useFormik } from "formik";
import { confirmPasswordSchema, passwordSchema } from "@/common/utils/validator/yup";
import * as yup from "yup";
import { ResetPasswordType } from "@/common/utils/supabase/server";
import { useRouter } from "next/navigation";
import { set } from "lodash";
import { IconLock } from "@tabler/icons-react";
import BaseTextField from "@/common/components/base/BaseTextField";
import BaseButton from "@/common/components/base/BaseButton";

type ResetPasswordStatus =
  | "idle"
  | "success"
  | "same_password"
  | "invalid_password"
  | "expired_token"
  | "network_error"
  | "unknown_error";



const validationSchema = yup.object({
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
});

export default function AuthResetPassword() {
  const { t } = useTranslation();
  const router = useRouter();
  const [status, setStatus] = useState<ResetPasswordStatus>("idle");

  const handleResetPassword = async (password: string) => {
    try {
      setStatus("success");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      setStatus("network_error");
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (data) => {
      await handleResetPassword(data.password);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack mt={4} spacing={2}>
        <BaseTextField
          name="password"
          formik={formik}
          label="รหัสผ่านใหม่"
          placeholder="กรุณากรอกรหัสผ่านใหม่"
          type="password"
          startAdornment={
            <InputAdornment position="start">
              <IconLock width={20} />
            </InputAdornment>
          }
        />
        <BaseTextField
          name="confirmPassword"
          formik={formik}
          label="ยืนยันรหัสผ่านใหม่"
          placeholder="กรุณากรอกรหัสผ่านใหม่อีกครั้ง"
          type="password"
          startAdornment={
            <InputAdornment position="start">
              <IconLock width={20} />
            </InputAdornment>
          }
        />
        <BaseButton
          label="ยืนยัน"
          type="submit"
          disabled={!formik.isValid || !formik.dirty}
        />
      </Stack>
    </form>
  );
}
