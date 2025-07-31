"use client";
import React, { useContext } from "react";
import { Box, Grid, Typography, Container } from "@mui/material";
import PricingCard from "./PricingCard";
import PaymentMethods from "./PaymentMethods";
import { PlanContext } from "@/common/contexts/Master/PlanContext";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";

const Pricing = () => {
  const { isLoading: IsPlanLoading } = useContext(PlanContext);
  const { loading: IsCustomizerLoading } = useContext(CustomizerContext);
  const isLoading = IsPlanLoading || IsCustomizerLoading;
  return (
    <>
      <Box
        sx={{
          py: {
            xs: 5,
            lg: 11,
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid
              size={{
                xs: 12,
                lg: 7,
              }}
            >
              <Typography
                textAlign="center"
                variant="h4"
                lineHeight={1.4}
                mb={6}
                fontWeight={700}
                sx={{
                  fontSize: {
                    lg: "40px",
                    xs: "35px",
                  },
                }}
              >
                ร่วมเป็นหนึ่งในแพลตฟอร์มของเรา!
              </Typography>
            </Grid>
          </Grid>

          <PricingCard isLoading={isLoading} />
          <PaymentMethods />
        </Container>
      </Box>
    </>
  );
};

export default Pricing;
