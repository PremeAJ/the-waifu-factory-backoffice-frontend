"use client";
import { Stack } from "@mui/system";
import BaseButton from "@/common/components/base/BaseButton/BaseButton";
import { IconBrandDiscord } from "@tabler/icons-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const SignInWithDiscordButton = () => {
  const onClick = () => {
    window.location.href = `${API_URL}/auth/discord`;
  };
  return (
    <Stack direction="row" justifyContent="center" mt={3}>
      <BaseButton
        variant="contained"
        size="large"
        label="Sign in with Discord"
        onClick={onClick}
        startIcon={<IconBrandDiscord size={20} />}
        sx={{
          backgroundColor: "#5865F2",
          "&:hover": {
            backgroundColor: "#4752C4",
          },
          width: "100%",
        }}
      />
    </Stack>
  );
};

export default SignInWithDiscordButton;
