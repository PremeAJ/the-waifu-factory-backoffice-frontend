"use client";
import { AuthContext } from "@/common/contexts/AuthContext";
import { Box, Typography, FormGroup, FormControlLabel, Button, Stack, Divider, InputAdornment } from "@mui/material";
import { emailValidator, requiredPasswordSchema } from "@/common/utils/validator/yup";
import { IconLock, IconMail } from "@tabler/icons-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import AuthSocialButtons from "./AuthSocialButtons";
import BaseTextField from "@/common/components/base/BaseTextField";
import CustomCheckbox from "@/components/forms/theme-elements/CustomCheckbox";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Turnstile from "react-turnstile";

const validationSchema = yup.object({
  email: emailValidator,
  password: requiredPasswordSchema,
});

const AuthLogin = () => {
  const { data: session, status } = useSession();
  const { t, i18n } = useTranslation();
  const [captchaToken, setCaptchaToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      setIsLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        captchaToken,
      });
      setIsLoading(false);
      if (result?.error) {
        setCaptchaToken("");
        formik.setFieldError("email", result?.error);
        formik.setFieldError("password", " ");
      } else {
        router.push("/auth/callback") 
      }
    },
  });

  // useEffect(() => {
  //   if (session && status === "authenticated"){
  //     signOut();
  //   }
  // }, [session, status]);

  useEffect(() => {
    if (!(formik.isValid && formik.dirty)) {
      setCaptchaToken("");
    }
  }, [formik.isValid, formik.dirty]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <Box>
            <BaseTextField
              name="email"
              formik={formik}
              label="Email"
              placeholder={`${t("Form.Validator.PleaseEnterYour")}${t("email")}`}
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
              placeholder={`${t("Form.Validator.PleaseEnterYour")}${t("password")}`}
              startAdornment={
                <InputAdornment position="start">
                  <IconLock width={20} />
                </InputAdornment>
              }
            />
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
            <FormGroup>
              <FormControlLabel control={<CustomCheckbox defaultChecked />} label={t("Page.Login.RememberThisDevice")} />
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
            <Turnstile sitekey={siteKey} theme="light" action="login" size="flexible" onSuccess={setCaptchaToken} language={i18n.language} />
          )}
          <Button color="primary" variant="contained" size="large" fullWidth type="submit" loading={isLoading} disabled={!captchaToken}>
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
            href="/auth/sign-up"
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
          <Typography component="span" color="textSecondary" variant="h6" fontWeight="400" position="relative" px={2}>
            or
          </Typography>
        </Divider>
      </Box>
      <AuthSocialButtons title="Sign in with"/>
    </>
  );
};

export default AuthLogin;
