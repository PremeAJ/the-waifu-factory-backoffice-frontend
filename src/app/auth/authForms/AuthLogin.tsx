"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { loginType } from "@/app/dashboard/(Layout)/types/auth/auth";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import AuthSocialButtons from "./AuthSocialButtons";
import * as yup from "yup";
import BaseTextField from "@/app/components/forms/theme-elements/BaseTextField";
import { AuthContext } from "@/app/context/AuthContext";
import { useFormik } from "formik";
import { emailValidator, passwordSchema } from "@/utils/validator/yup";
import { useTranslation } from "react-i18next";
import Language from "@/app/dashboard/(Layout)/layout/vertical/header/Language";

const validationSchema = yup.object({
  email: emailValidator,
  password: passwordSchema,
});

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const { t } = useTranslation();
  const {
    signOut,
    signInWithEmail,
    isLoading: authIsLoading,
  } = useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      firstName: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      const { error } = await signInWithEmail(data);
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
          default:
            break;
        }
      } else {
        window.location.href = "/";
      }
    },
  });

  useEffect(() => {
    signOut();
  }, []);

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1} justifyContent="space-between" display="flex">
          {title} <Language />
        </Typography>
      ) : null}

      {subtext}

      <AuthSocialButtons title="Sign in with" />
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
            or sign in with
          </Typography>
        </Divider>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <Box>
            <BaseTextField
              name="email"
              formik={formik}
              label="Email"
              placeholder={`${t('Form.Validator.PleaseEnterYour')}${t('email')}`}
            />
          </Box>
          <Box>
            <BaseTextField
              name="password"
              formik={formik}
              label="Password"
              type="password"
              placeholder={`${t('Form.Validator.PleaseEnterYour')}${t('password')}`}
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
                label={t('Page.Login.RememberThisDevice')}
              />
            </FormGroup>
            <Typography
              component={Link}
              href="/auth/auth1/forgot-password"
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
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            loading={authIsLoading}
          >
            {t('Page.Login.SignIn')}
          </Button>
        </Box>
      </form>
      {subtitle}
    </>
  );
};

export default AuthLogin;
