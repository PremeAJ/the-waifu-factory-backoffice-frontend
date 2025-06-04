
import { Grid, Box, Card } from "@mui/material";

// components
import Logo from "@/app/dashboard/(Layout)/layout/shared/logo/Logo";
import PageContainer from "@/components/container/PageContainer";
import { ServerLanguage } from "@/components/shared/Language/ServerLanguage";
import AuthLogin from "@/components/auth/AuthLogin";

export default function Login2() {
  return (
    (<PageContainer title="Login Page" description="this is Sample page">
      <Box
        sx={{
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
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            display="flex"
            justifyContent="center"
            alignItems="center"
            size={{
              xs: 12,
              sm: 12,
              lg: 5,
              xl: 4
            }}>
            <Card
              elevation={9}
              sx={{
                p: 4,
                zIndex: 1,
                width: "100%",
                maxWidth: "450px",
                height: { xs: "100%", sm: "auto" },
                minHeight: { xs: "100%", sm: "auto" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
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
                <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                  <ServerLanguage />
                </Box>
              </Box>
              <AuthLogin isDashboard={true}/>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>)
  );
}
