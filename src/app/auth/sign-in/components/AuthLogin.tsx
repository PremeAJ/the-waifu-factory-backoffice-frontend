"use client";
import { Box, Typography, FormGroup, FormControlLabel, Button, Stack, Divider, InputAdornment } from "@mui/material";
import { emailValidator, isBoolean, requiredPasswordSchema } from "@/common/utils/validator/yup";
import { IconLock, IconMail } from "@tabler/icons-react";
import { PageUrl } from "@/common/constants/pageUrl";
import { signIn } from "next-auth/react";
import { useEncrypt } from "@/common/contexts/EncryptContext";
import { useFormik } from "formik";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import BaseButton from "@/common/components/base/BaseButton";
import BaseLinkButton from "@/common/components/base/BaseLinkButton";
import BaseTextField from "@/common/components/base/BaseTextField";
import CustomCheckbox from "@/components/forms/theme-elements/CustomCheckbox";
import React, { useEffect, useState } from "react";
import SignInWithGoogleButton from "../../components/SignInWithGoogleButton";
import Turnstile from "react-turnstile";
import BaseCheckBox from "@/common/components/base/BaseCheckBox";

const validationSchema = yup.object({
  email: emailValidator,
  password: requiredPasswordSchema,
  rememberMe: isBoolean,
});

const AuthLogin = () => {
  const isDev = process.env.NODE_ENV === "development";
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [captchaToken, setCaptchaToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { appearance } = useProfile();
  const { encrypt } = useEncrypt();

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      setIsLoading(true);
      const encryptedPayload = {
        email: encrypt(data.email),
        password: encrypt(data.password),
        rememberMe: data.rememberMe,
      };
      const result = await signIn("credentials", {
        redirect: false,
        captchaToken,
        ...encryptedPayload,
      });
      setIsLoading(false);
      if (result?.error) {
        setCaptchaToken("");
        formik.setFieldError("email", result?.error);
        formik.setFieldError("password", " ");
      } else {
        router.push(PageUrl.CALLBACK);
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
            <BaseCheckBox
              name="consents"
              checked={formik.values.rememberMe}
              onChange={() => formik.setFieldValue("rememberMe", !formik.values.rememberMe)}
              label={t("Page.Login.RememberThisDevice")}
            />
            <BaseLinkButton underline={false} onClick={() => router.push("/auth/forgot-password")} label={`${t("Page.Login.ForgotPassword")} ?`} />
          </Stack>
        </Stack>
        <Box>
          {formik.isValid && formik.dirty && formik.values.password.length > 6 && !isDev && (
            <Turnstile
              sitekey={siteKey}
              theme={appearance.activeMode || "light"}
              action="login"
              size="flexible"
              onSuccess={setCaptchaToken}
              language={i18n.language}
            />
          )}
          <BaseButton type="submit" loading={isLoading} disabled={!captchaToken && !isDev} label={t("Page.Login.SignIn")} />
        </Box>
      </form>
      <Stack direction="row" spacing={1} mt={3}>
        <Typography color="textSecondary" variant="h6" fontWeight="500">
          {t("Page.Login.DontHaveAccount")} ?
        </Typography>
        <BaseLinkButton underline={false} onClick={() => router.push(PageUrl.AUTH_SIGN_UP)} label={t("Page.Login.CreateAnAccount")} />
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

export default AuthLogin;
