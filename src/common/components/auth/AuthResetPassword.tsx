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

// สร้าง type สำหรับ status
type ResetPasswordStatus =
  | "idle"
  | "success"
  | "same_password"
  | "invalid_password"
  | "expired_token"
  | "network_error"
  | "unknown_error";

// สร้าง map ของข้อความ error
const getAlertMessage = (status: ResetPasswordStatus): string => {
  const messages: Record<ResetPasswordStatus, string> = {
    idle: "",
    success: "เปลี่ยนรหัสผ่านสำเร็จ",
    same_password: "รหัสผ่านใหม่ไม่สามารถตรงกับรหัสผ่านเดิมได้",
    invalid_password: "รหัสผ่านไม่ถูกต้องตามเงื่อนไข",
    expired_token: "ลิงก์หมดอายุ กรุณาขอลิงก์ใหม่",
    network_error: "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง",
    unknown_error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
  };
  return messages[status];
};

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
      // const { error } = await resetPassword({ newPassword: password });

      // if (error) {
      //   switch (error) {
      //     case "same_password":
      //       setStatus("same_password");
      //       break;
      //     case "invalid_password":
      //       setStatus("invalid_password");
      //       break;
      //     case "expired_token":
      //       setStatus("expired_token");
      //       setTimeout(() => router.push("/auth/forgot-password"), 2000);
      //       break;
      //     default:
      //       setStatus("unknown_error");
      //   }
      //   return;
      // }

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
          loading={isLoading}
          type="submit"
          disabled={!formik.isValid || !formik.dirty}
        />
        {renderAlert()}
      </Stack>
    </form>
  );
}
