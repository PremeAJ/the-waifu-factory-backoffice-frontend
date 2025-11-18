"use client";
import { confirmPasswordSchema, passwordSchema } from "@/common/utils/validator/yup";
import { IconLock } from "@tabler/icons-react";
import { InputAdornment, Stack } from "@mui/material";
import { ResetPasswordPayload } from "@/common/contexts/AuthContext/interfaces/interface";
import { useAuth } from "@/common/contexts/AuthContext";
import { useDialog } from "@/common/contexts/DialogContext";
import { useEffect } from "react";
import { useEncrypt } from "@/common/contexts/EncryptContext";
import { useFormik } from "formik";
import { useParams, useSearchParams } from "next/navigation";
import { uuidV4Regex } from "@/common/utils/validator/regex";
import * as yup from "yup";
import BaseButton from "@/common/components/base/BaseButton/BaseButton";
import BaseTextField from "@/common/components/base/BaseTextField";
import { PageUrl } from "@/common/constants/pageUrl";

const validationSchema = yup.object({
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
});

export default function AuthResetPassword() {
  const { showSuccess, showError } = useDialog();
  const { resetPassword, loading } = useAuth();
  const searchParams = useSearchParams();
  const encryptedCode = searchParams.get("code");
  const { type, userId } = useParams();
  const { encrypt, decrypt } = useEncrypt();
  const code = encryptedCode ? decrypt(encryptedCode) : null;
  useEffect(() => {
    if (!code) {
      showError({ message: "Missing code parameter" });
    }
    if (type !== "reset" && type !== "forgot") {
      showError({ message: "Invalid type parameter" });
    }
    if (!userId || !uuidV4Regex.test(userId.toString())) {
      showError({ message: "Invalid userId parameter" });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (data) => {
      const payload: ResetPasswordPayload = {
        id: userId?.toString() || "",
        code: encrypt(code?.toString() || ""),
        newPassword: data.password,
        confirmNewPassword: data.confirmPassword,
      };
      const response = await resetPassword(payload);
      if (response?.error) {
        showError({
          message: response?.message,
        });
      } else {
        showSuccess({
          message: response?.data?.message || "รีเซ็ตรหัสผ่านสำเร็จ",
          callback: PageUrl.AUTH_SIGN_IN,
          disableBackdropClose: true,
        });
      }
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
        <BaseButton label="ยืนยัน" type="submit" disabled={!formik.isValid || !formik.dirty} loading={loading} />
      </Stack>
    </form>
  );
}
