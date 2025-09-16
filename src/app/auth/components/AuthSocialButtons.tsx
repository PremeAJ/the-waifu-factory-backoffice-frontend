"use client";
import { Avatar, Box } from "@mui/material";
import { signIn } from "next-auth/react";
import { signInType } from "@/common/utils/types/auth/auth";
import { Stack } from "@mui/system";
import CustomSocialButton from "@/components/forms/theme-elements/CustomSocialButton";
import { PageUrl } from "@/common/constants/pageUrl";

const AuthSocialButtons = ({ title }: signInType) => {
  const onClick = () => {
    signIn("google", { callbackUrl: PageUrl.CALLBACK });
  };
  return (
    <>
      <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
        <CustomSocialButton onClick={onClick} >
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
              whiteSpace: "nowrap",
              mr: { sm: "3px" },
            }}
          >
            {title}{" "}
          </Box>{" "}
          Google
        </CustomSocialButton>
      </Stack>
    </>
  );
};

export default AuthSocialButtons;
