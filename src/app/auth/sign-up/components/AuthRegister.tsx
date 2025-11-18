"use client";
import { Box, Typography, Button, Divider, Stack, Grid, InputAdornment } from "@mui/material";
import { confirmPasswordSchema, emailValidator, firstNameSchema, lastNameSchema, passwordSchema } from "@/common/utils/validator/yup";
import { genOtpUrl } from "@/common/utils/otpUrl";
import { IconLock, IconMail } from "@tabler/icons-react";
import { PageUrl } from "@/common/constants/pageUrl";
import { RegisterPayload } from "@/common/contexts/AuthContext/interfaces/interface";
import { useAuth } from "@/common/contexts/AuthContext";
import { useDialog } from "@/common/contexts/DialogContext";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import BaseButton from "@/common/components/base/BaseButton/BaseButton";
import BaseLinkButton from "@/common/components/base/BaseLinkButton";
import BaseTextField from "@/common/components/base/BaseTextField";
import SignInWithGoogleButton from "../../components/SignInWithGoogleButton";
import Turnstile from "react-turnstile";

const validationSchema = yup.object({
  email: emailValidator,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
});

const AuthRegister = () => {
  const isDev = process.env.NODE_ENV === "development";
  const [captchaToken, setCaptchaToken] = useState("");
  const { register, loading } = useAuth();
  const { appearance } = useProfile();
  const { showError } = useDialog();
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
              inputProps={{
                inputMode:'email'
              }}
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
          {formik.isValid && formik.dirty && !isDev &&(
            <Turnstile
              sitekey={siteKey}
              theme={appearance.activeMode}
              action="register"
              size="flexible"
              onSuccess={setCaptchaToken}
              language={i18n.language}
            />
          )}
          <BaseButton type="submit" disabled={!captchaToken && !isDev} loading={loading} label="Sign Up" />
        </form>
      </Box>
      <Stack direction="row" spacing={1} mt={3}>
        <Typography color="textSecondary" variant="h6" fontWeight="400">
          Already have an Account?
        </Typography>
        <BaseLinkButton
        label={t("Page.Login.SignIn")}
        onClick={() => router.push(PageUrl.AUTH_SIGN_IN)}
        />
      </Stack>
      <Box mt={3}>
        <Divider>
          <Typography component="span" color="textSecondary" variant="h6" fontWeight="400" position="relative" px={2}>
            or
          </Typography>
        </Divider>
      </Box>
      <SignInWithGoogleButton />
    </>
  );
};

export default AuthRegister;
