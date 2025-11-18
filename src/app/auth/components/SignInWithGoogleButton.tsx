"use client";
import { Avatar, Box } from "@mui/material";
import { signIn } from "next-auth/react";
import { Stack } from "@mui/system";
import { PageUrl } from "@/common/constants/pageUrl";
import BaseButton from "@/common/components/base/BaseButton/BaseButton";

const SignInWithGoogleButton = () => {
  const onClick = async () => {
    await signIn("google", { callbackUrl: PageUrl.CALLBACK });
  };
  return (
    <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
      <BaseButton
        variant="outlined"
        color="inherit"
        size="large"
        label='Sign in with Google'
        onClick={onClick}
        startIcon={
          <Avatar
            src="/images/svgs/google-icon.svg"
            alt="Google"
            sx={{
              width: 16,
              height: 16,
              borderRadius: 0,
              mr: 1,
            }}
          />
        }
        sx={{
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      />
    </Stack>
  );
};

export default SignInWithGoogleButton;
