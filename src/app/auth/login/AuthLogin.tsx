"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import Turnstile from "react-turnstile";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  InputAdornment,
} from "@mui/material";
import Link from "next/link";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import AuthSocialButtons from "../authForms/AuthSocialButtons";
import * as yup from "yup";
import BaseTextField from "@/app/components/forms/theme-elements/BaseTextField";
import { AuthContext } from "@/app/context/AuthContext";
import { useFormik } from "formik";
import { emailValidator, requiredPasswordSchema } from "@/utils/validator/yup";
import { useTranslation } from "react-i18next";
import Language from "@/app/components/shared/Language/Language";
import { SignInWithPasswordCredentials } from "@supabase/supabase-js";
import { IconLock, IconMail } from "@tabler/icons-react";

const validationSchema = yup.object({
  email: emailValidator,
  password: requiredPasswordSchema,
});

const AuthLogin = () => {
  const {
    signOut,
    signInWithEmail,
    isLoading: authIsLoading,
  } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [captchaToken, setCaptchaToken] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      const userData: SignInWithPasswordCredentials = {
        email: data.email,
        password: data.password,
        options: {
          captchaToken: captchaToken,
        },
      };
      const { error } = await signInWithEmail(userData);
      if (error) {
        setCaptchaToken("");
        switch (error) {
          case "email_not_confirmed":
            alert("กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ");
            break;
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
            alert(
              "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง หรือรีเฟรชหน้า"
            );
            break;
          default:
            alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
            break;
        }
      } else {
        window.location.href = "/auth/callback";
      }
    },
  });

  useEffect(() => {
    signOut();
  }, []);

  useEffect(() => {
    if (!(formik.isValid && formik.dirty)) {
      setCaptchaToken("");
    }
  }, [formik.isValid, formik.dirty]);

  return (
    <>
      <Typography
        fontWeight="700"
        variant="h3"
        mb={1}
        justifyContent="space-between"
        display="flex"
      >
        {t("Page.Login.WelcomeToMeowSom")} <Language />
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <Box>
            <BaseTextField
              name="email"
              formik={formik}
              label="Email"
              placeholder={`${t("Form.Validator.PleaseEnterYour")}${t(
                "email"
              )}`}
              startAdornment={
                <InputAdornment position="start">
                  <IconMail width={20} />
                </InputAdornment>
              }
            />
          </Box>
          <Box>
            <BaseTextField
              name="password"
              formik={formik}
              label="Password"
              type="password"
              placeholder={`${t("Form.Validator.PleaseEnterYour")}${t(
                "password"
              )}`}
              startAdornment={
                <InputAdornment position="start">
                  <IconLock width={20} />
                </InputAdornment>
              }
            />
          </Box>
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
          >
            <FormGroup>
              <FormControlLabel
                control={<CustomCheckbox defaultChecked />}
                label={t("Page.Login.RememberThisDevice")}
              />
            </FormGroup>
            <Typography
              component={Link}
              href="/auth/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "primary.main",
              }}
            >
              {t("Page.Login.ForgotPassword")} ?
            </Typography>
          </Stack>
        </Stack>
        <Box>
          {formik.isValid && formik.dirty && (
            <Turnstile
              sitekey={siteKey}
              theme="light"
              action="login"
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
            loading={authIsLoading}
            disabled={!captchaToken}
          >
            {t("Page.Login.SignIn")}
          </Button>
        </Box>
      </form>
      <Stack direction="row" spacing={1} mt={3}>
        <Typography color="textSecondary" variant="h6" fontWeight="500">
          {t("Page.Login.DontHaveAccount")} ?
        </Typography>
        <Typography
          component={Link}
          href="/auth/register"
          fontWeight="500"
          sx={{
            textDecoration: "none",
            color: "primary.main",
          }}
        >
          {t("Page.Login.CreateAnAccount")}
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
            or
          </Typography>
        </Divider>
      </Box>
      <AuthSocialButtons title="Sign in with" />
    </>
  );
};

export default AuthLogin;
