"use client";
import { Grid, Box, Typography } from "@mui/material";
import { useEncrypt } from "@/common/contexts/EncryptContext";
import { useParams } from "next/navigation";
import AuthTwoSteps from "@/app/auth/components/AuthTwoSteps";
import Image from "next/image";
import PageContainer from "@/components/container/PageContainer";

export default function VerifyOtp() {
  const params = useParams();
  const { decrypt } = useEncrypt();
  const { type, reciver, action, id, ref } = params;
  const decryptedReciver = decrypt(reciver?.toString() || '');
  return (
    <PageContainer title="Two steps Page" description="this is Sample page">
      <Grid container spacing={0} justifyContent="center" sx={{ height: "100vh" }}>
        <Grid
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
          size={{
            xs: 12,
            sm: 12,
            lg: 8,
            xl: 9,
          }}
        >
          <Box position="relative">
            <Box px={3} mt={3}></Box>
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
          sx={{
            height: "100vh",
          }}
        >
          <Box p={4}>
            <Typography variant="h4" fontWeight="700">
              Two Step Verification
            </Typography>

            <Typography variant="subtitle1" color="textSecondary" mt={2} mb={1}>
              We sent a verification code to your {type}. Enter the code from the mobile in the field below.
            </Typography>
            <Typography variant="subtitle1" fontWeight="700" mb={1}>
              {decryptedReciver}
            </Typography>
            <AuthTwoSteps />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
