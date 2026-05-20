"use client";
import { Box, Typography } from "@mui/material";
import SignInWithDiscordButton from "../../components/SignInWithDiscordButton";

const AuthLogin = () => {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={1} textAlign="center">
        Welcome to The Waifu Factory
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={3} textAlign="center">
        Sign in with your Discord account to continue
      </Typography>
      <SignInWithDiscordButton />
    </Box>
  );
};

export default AuthLogin;
