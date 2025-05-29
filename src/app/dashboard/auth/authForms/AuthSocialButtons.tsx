"use client";
import CustomSocialButton from "@/app/components/forms/theme-elements/CustomSocialButton";
import { Stack } from "@mui/system";
import { Avatar, Box } from "@mui/material";
import { signInType } from "@/utils/types/auth/auth";
import { useContext } from "react";
import { AuthContext } from "@/app/context/AuthContext";

const AuthSocialButtons = ({ title }: signInType) => {
  const { signInWithGoogle, isLoading } = useContext(AuthContext);
  const onClick = () => {
    const redirectTo = `${window.location.origin}/dashboard/auth/callback`;
    signInWithGoogle(redirectTo);
  };
  return (
    <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
      <CustomSocialButton onClick={onClick} loading={isLoading}>
        <Avatar
          src={"/images/svgs/google-icon.svg"}
          alt={"icon1"}
          sx={{
            width: 16,
            height: 16,
            borderRadius: 0,
            mr: 1,
          }}
        />
        <Box
          sx={{
            // display: { xs: "none", sm: "flex" },
            whiteSpace: "nowrap",
            mr: { sm: "3px" },
          }}
        >
          {title}{" "}
        </Box>{" "}
        Google
      </CustomSocialButton>
    </Stack>
  );
};

export default AuthSocialButtons;
