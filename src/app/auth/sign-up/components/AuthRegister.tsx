"use client";
import { Box, Typography, Button, Divider, Stack, Grid, InputAdornment } from "@mui/material";
import { confirmPasswordSchema, emailValidator, firstNameSchema, lastNameSchema, passwordSchema } from "@/common/utils/validator/yup";
import { IconLock, IconMail } from "@tabler/icons-react";
import { RegisterPayload } from "@/common/contexts/AuthContext/interfaces/interface";
import { useAuth } from "@/common/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useError } from "@/common/contexts/ErrorContext";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import AuthSocialButtons from "../../components/AuthSocialButtons";
import BaseTextField from "@/common/components/base/BaseTextField";
import Link from "next/link";
import Turnstile from "react-turnstile";
import { useEncrypt } from "@/common/contexts/EncryptContext";
import { useProfile } from "@/common/contexts/ProfileContext";
import { genOtpUrl } from "@/common/utils/otpUrl";

const validationSchema = yup.object({
  email: emailValidator,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
});

const AuthRegister = () => {
  const [captchaToken, setCaptchaToken] = useState("");
  const { register, loading } = useAuth();
  const { appearance } = useProfile();
  const { showError } = useError();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const formik = useFormik({
    initialValues: {
      confirmPassword: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data: RegisterPayload) => {
      const response = await register(data);
      if (response.statusCode !== 201) {
        showError(response.message, "เกิดข้อผิดพลาด");
      } else {
        const { id, otpRef, otpType, email } = response.data;
        const url = genOtpUrl({ type: "email", reciver: email, otpType, id, otpRef });
        router.push(url);
      }
    },
  });

  useEffect(() => {
    if (!(formik.isValid && formik.dirty)) {
      setCaptchaToken("");
    }
  }, [formik.isValid, formik.dirty]);

  return (
    <>
      <Box>
        <form onSubmit={formik.handleSubmit}>
          <Stack mb={3}>
            <Grid container columnSpacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <BaseTextField name="firstName" formik={formik} label="ชื่อ" placeholder="กรุณากรอก ชื่อ" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <BaseTextField name="lastName" formik={formik} label="นามสกุล" placeholder="กรุณากรอก นามสกุล" />
              </Grid>
            </Grid>
            <BaseTextField
              name="email"
              formik={formik}
              label="Email Adddress"
              placeholder="กรุณากรอก อีเมล"
              startAdornment={
                <InputAdornment position="start">
                  <IconMail width={20} />
                </InputAdornment>
              }
            />
            <BaseTextField
              name="password"
              formik={formik}
              label="Password"
              placeholder="กรุณากรอก รหัสผ่าน"
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
              label="Confirm Password"
              placeholder="กรุณายืนยัน รหัสผ่าน"
              type="password"
              startAdornment={
                <InputAdornment position="start">
                  <IconLock width={20} />
                </InputAdornment>
              }
            />
          </Stack>
          {formik.isValid && formik.dirty && (
            <Turnstile sitekey={siteKey} theme={appearance.activeMode} action="register" size="flexible" onSuccess={setCaptchaToken} language={i18n.language} />
          )}
          <Button color="primary" variant="contained" size="large" fullWidth type="submit" disabled={!captchaToken} loading={loading}>
            Sign Up
          </Button>
        </form>
      </Box>
      <Stack direction="row" spacing={1} mt={3}>
        <Typography color="textSecondary" variant="h6" fontWeight="400">
          Already have an Account?
        </Typography>
        <Typography
          component={Link}
          href="/auth/sign-in"
          fontWeight="500"
          sx={{
            textDecoration: "none",
            color: "primary.main",
          }}
        >
          Sign In
        </Typography>
      </Stack>
      <Box mt={3}>
        <Divider>
          <Typography component="span" color="textSecondary" variant="h6" fontWeight="400" position="relative" px={2}>
            or
          </Typography>
        </Divider>
      </Box>
      <AuthSocialButtons title="Sign up with" />
    </>
  );
};

export default AuthRegister;
