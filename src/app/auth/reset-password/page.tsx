"use client";
import { Grid, Box, Typography } from "@mui/material";
import Logo from "@/app/dashboard/(Layout)/layout/shared/logo/Logo";
import PageContainer from "@/app/components/container/PageContainer";
import Image from "next/image";
import AuthResetPassword from "./AuthResetPassword";
import { useContext, useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";

export default function ResetPassword() {
  const { exchangeCodeForSession } = useContext(AuthContext);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    if (!code) {
      redirect("/auth/error/404");
    }
    const getSession = async () => {
      const { error } = await exchangeCodeForSession(code);
      if (error) {
        redirect("/auth/error/404");
      }
      setIsValid(true)
    };
    getSession();
  }, []);
  return (
    isValid && (
      <PageContainer
        title="Forgot Password Page"
        description="this is Sample page"
      >
        <Grid
          height={"100vh"}
          container
          justifyContent="center"
          spacing={0}
          sx={{ overflowX: "hidden" }}
        >
          <Grid
            sx={{
              display: { xs: "none", lg: "block" },
              position: "relative",
              "&:before": {
                content: '""',
                background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
                backgroundSize: "400% 400%",
                animation: "gradient 15s ease infinite",
                position: "absolute",
                height: "100%",
                width: "100%",
                opacity: "0.3",
              },
            }}
            size={{
              xs: 12,
              sm: 12,
              lg: 8,
              xl: 9,
            }}
          >
            <Box position="relative">
              <Box px={3}>
                <Logo />
              </Box>
              <Box
                alignItems="center"
                justifyContent="center"
                height={"calc(100vh - 75px)"}
                sx={{
                  display: {
                    xs: "none",
                    lg: "flex",
                  },
                }}
              >
                <Image
                  src={"/images/backgrounds/login-bg.svg"}
                  alt="bg"
                  width={500}
                  height={500}
                  style={{
                    width: "100%",
                    maxWidth: "500px",
                    maxHeight: "500px",
                  }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid
            display="flex"
            justifyContent="center"
            alignItems="center"
            size={{
              xs: 12,
              sm: 12,
              lg: 4,
              xl: 3,
            }}
          >
            <Box p={4} width={'100%'}>
              <Typography variant="h4" fontWeight="700">
                Reset Password
              </Typography>

              <Typography
                color="textSecondary"
                variant="subtitle2"
                fontWeight="400"
                mt={2}
              >
                Please enter your new password
              </Typography>
              <AuthResetPassword />
            </Box>
          </Grid>
        </Grid>
      </PageContainer>
    )
  );
}
