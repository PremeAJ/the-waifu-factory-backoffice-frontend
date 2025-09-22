"use client";
import { Grid, Box, Typography } from "@mui/material";
import AuthForgotPassword from "./components/AuthForgotPassword";
import Image from "next/image";
import PageContainer from "@/components/container/PageContainer";
import Logo from "@/common/components/shared/Logo";

export default function ForgotPassword() {
  return (
    (<PageContainer
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
            xl: 9
          }}>
          <Box position="relative">
            <Box pb={5}>
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
            xl: 3
          }}>
          <Box p={4} width={'100%'} maxWidth={500}>
            <Box display="flex" alignItems="center" justifyContent="center" sx={{ width: "100%", mb: 2 }}>
              <Logo size="large" />
            </Box>
            <Typography variant="h4" fontWeight="700">
              ลืมรหัสผ่าน?
            </Typography>

            <Typography
              color="textSecondary"
              variant="subtitle2"
              fontWeight="400"
              mt={2}
            >
              กรุณากรอกอีเมลที่เชื่อมกับบัญชีของคุณ แล้วเราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปทางอีเมลของคุณ
            </Typography>
            <AuthForgotPassword />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>)
  );
}
