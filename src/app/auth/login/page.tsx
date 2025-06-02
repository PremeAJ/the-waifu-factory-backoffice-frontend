import { Grid, Box, Stack, Typography } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import Logo from "@/app/dashboard/(Layout)/layout/shared/logo/Logo";
import Image from "next/image";
import AuthLogin from "../authForms/AuthLogin";
import { ServerLanguage } from "@/app/components/shared/Language/ServerLanguage";

export default function Login() {
  return (
    <PageContainer title="Login Page" description="this is Sample page">
      <Grid
        container
        spacing={0}
        justifyContent="center"
        sx={{ height: "100vh" }}
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
            lg: 7,
            xl: 8,
          }}
        >
          <Box position="relative">
            {/* <Box px={3}>
              <Logo />
            </Box> */}
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
            lg: 5,
            xl: 4,
          }}
        >
          <Box p={4} width={"100%"} maxWidth={500}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: "100%"}}
            >
              <Box sx={{ flex: 1 }} />
              <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <Logo />
              </Box>
              <Box
                sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
              >
                <ServerLanguage />
              </Box>
            </Box>
            <AuthLogin />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
