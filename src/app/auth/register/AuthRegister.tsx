'use client'
import { Box, Typography, Button, Divider, Stack, Grid } from "@mui/material";
import Link from "next/link";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { registerType } from "@/utils/types/auth/auth";
import AuthSocialButtons from "../authForms/AuthSocialButtons";
import BaseTextField from "@/app/components/forms/theme-elements/BaseTextField";
import { confirmPasswordSchema, emailValidator, lastNameSchema, nameSchema, passwordSchema } from "@/utils/validator/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/app/context/AuthContext";
import { useContext, useState } from "react";
import { useFormik } from "formik";
import Language from "@/app/components/shared/Language/Language";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import Turnstile from "react-turnstile";

const validationSchema = yup.object({
  email: emailValidator,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
  firstName: nameSchema,
  lastName: lastNameSchema
})

const AuthRegister = () => {
  const { t, i18n } = useTranslation();
  const [captchaToken, setCaptchaToken] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const { signUpWithEmail } = useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      const { email, password, firstName, lastName } = data;
      const userData: SignUpWithPasswordCredentials = {
        email,
        password,
        options: {
          data: {
            full_name: '' + firstName + ' ' + lastName,
          },
          captchaToken: captchaToken,
        }
      }
      const { data: data2, error } = await signUpWithEmail(userData);
      if (error) {
        switch (error) {
          case "invalid_credentials":
            formik.setFieldError("email", "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            formik.setFieldError("password", "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            break;
          case "over_request_rate_limit":
            alert(
              "คุณส่งคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง (Rate limit reached)"
            );
            break;
          case "user_banned":
            alert("บัญชีของคุณถูกระงับ กรุณาติดต่อผู้ดูแลระบบ");
            break;
          case "captcha_failed":
          case "unexpected_failure":
            alert("เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง หรือรีเฟรชหน้า");
            break;
          default:
            alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
            break;
        }
      } else {
        window.location.href = "/auth/login";
      }
    },
  });

  return (
    <>
      <Typography fontWeight="700" variant="h3" mb={1} justifyContent="space-between" display="flex">
        Sign up to MeowSom  <Language />
      </Typography>
      <Box>
        <form onSubmit={formik.handleSubmit}>
          <Stack mb={3}>
            <Grid container columnSpacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <BaseTextField
                  name="firstName"
                  formik={formik}
                  label="ชื่อ"
                  placeholder="กรุณากรอก ชื่อ"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <BaseTextField
                  name="lastName"
                  formik={formik}
                  label="นามสกุล"
                  placeholder="กรุณากรอก นามสกุล"
                />
              </Grid>
            </Grid>
            <BaseTextField
              name="email"
              formik={formik}
              label="Email Adddress"
              placeholder="กรุณากรอก อีเมล"
            />
            <BaseTextField
              name="password"
              formik={formik}
              label="Password"
              placeholder="กรุณากรอก รหัสผ่าน"
              type="password"
            />
            <BaseTextField
              name="confirmPassword"
              formik={formik}
              label="Confirm Password"
              placeholder="กรุณายืนยันรหัสผ่าน"
              type="password"
            />
          </Stack>
          {formik.isValid && formik.dirty && (
            <Turnstile
              sitekey={siteKey}
              theme="light"
              action="register"
              size="flexible"
              onSuccess={setCaptchaToken}
              language={i18n.language}
            />
          )}
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
          >
            Sign Up
          </Button>
        </form>
      </Box >
      <Stack direction="row" spacing={1} mt={3}>
        <Typography color="textSecondary" variant="h6" fontWeight="400">
          Already have an Account?
        </Typography>
        <Typography
          component={Link}
          href="/auth/login"
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
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            or sign up with
          </Typography>
        </Divider>
      </Box>
      <AuthSocialButtons title="Sign up with" />
    </>
  )
}

export default AuthRegister;
