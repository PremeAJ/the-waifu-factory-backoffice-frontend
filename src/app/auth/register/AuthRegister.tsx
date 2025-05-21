'use client'
import { Box, Typography, Button, Divider } from "@mui/material";
import Link from "next/link";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { Stack } from "@mui/system";
import { registerType } from "@/utils/types/auth/auth";
import AuthSocialButtons from "../authForms/AuthSocialButtons";

const AuthRegister = ({ title, subtext }: registerType) => (
  <>
    {title ? (
      <Typography fontWeight="700" variant="h3" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}

    <Box>
      <Stack mb={3}>
        <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
        <CustomTextField id="name" variant="outlined" fullWidth />
        <CustomFormLabel htmlFor="email">Email Adddress</CustomFormLabel>
        <CustomTextField id="email" variant="outlined" fullWidth />
        <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
        <CustomTextField id="password" variant="outlined" fullWidth />
      </Stack>
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        component={Link}
        href="/auth/auth1/login"
      >
        Sign Up
      </Button>
    </Box>
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
);

export default AuthRegister;
