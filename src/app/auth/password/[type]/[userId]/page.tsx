"use client";
import { Grid, Box, Typography } from "@mui/material";
import AuthResetPassword from "../../components/AuthResetPassword";
import Image from "next/image";
import PageContainer from "@/components/container/PageContainer";
import useIsPWA from "@/common/utils/state/useIsPWA";

export default function ResetPassword() {
  const isPWA = useIsPWA();

  return (
    <PageContainer title="Forgot Password Page" description="this is Sample page">
      <Grid container spacing={0} justifyContent="center" sx={{ height: isPWA ? "90vh" : "100vh" }}>
        <Grid
          sx={{
            display: { xs: "none", lg: "block" },
            position: "relative",
            "&:before": {
              content: '""',
              background: "radial-gradient(#d2f1df, #fad3d3ff, #bad8f4)",
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
            <Box px={3} mt={5}></Box>
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
          <Box p={4} width={"100%"} maxWidth={500}>
            <Typography variant="h4" fontWeight="700">
              รีเซ็ตรหัสผ่าน
            </Typography>

            <Typography color="textSecondary" variant="subtitle2" fontWeight="400" mt={2}>
              กรุณากรอกรหัสผ่านใหม่ของคุณ
            </Typography>
            <AuthResetPassword />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
