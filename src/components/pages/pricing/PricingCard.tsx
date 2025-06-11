"use client";
import React, { useContext } from "react";
import { Box, Grid, Typography, Chip, CardContent, Divider, Stack, Button } from "@mui/material";
import Image from "next/image";
import BlankCard from "../../shared/BlankCard";
import { UserContext } from "@/context/UserContext";
import { PlanContext } from "@/context/PlanContext";
import { I18nString } from "@/utils/i18n/I18nString";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Skeleton from "@mui/material/Skeleton";

const FeatureIcon = ({ checked }: { checked: boolean }) => (
  <Image
    src={checked ? "/images/frontend-pages/icons/icon-check.svg" : "/images/frontend-pages/icons/icon-close.svg"}
    alt={checked ? "check" : "close"}
    width={20}
    height={20}
  />
);

interface PricingCardProps {
  isLoading?: boolean;
}

const PricingCard = ({ isLoading }: PricingCardProps) => {
  const { plan: planData, error } = useContext(PlanContext);
  const { user } = useContext(UserContext);
  const { i18n } = useTranslation();
  const router = useRouter();
  const { language } = i18n;
  const { hasReceivedTrial } = user || {};
  const featureList: { key: string; labelTh: string; labelEn: string }[] = [
    { key: "pos", labelTh: "ระบบขายหน้าร้าน (POS)", labelEn: "POS System" },
    { key: "crm", labelTh: "ระบบลูกค้าสัมพันธ์ (CRM)", labelEn: "CRM" },
    { key: "hrm", labelTh: "ระบบบริหารบุคคล (HRM)", labelEn: "HRM" },
    { key: "inventory", labelTh: "คลังสินค้า", labelEn: "Inventory" },
    { key: "multiUser", labelTh: "ผู้ใช้หลายคน", labelEn: "Multi-user" },
    { key: "support", labelTh: "ซัพพอร์ต", labelEn: "Support" },
    { key: "update", labelTh: "อัปเดตฟรี", labelEn: "Free Updates" },
    { key: "api", labelTh: "API เชื่อมต่อ", labelEn: "API Access" },
    { key: "custom", labelTh: "ปรับแต่งระบบ", labelEn: "Customizable" },
  ];

  const onClickPlan = () => {
    if (user) {
      router.push("/dashboard/create-company");
    } else {
      router.push("/auth/register");
    }
  };

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid key={i} size={{ xs: 12, lg: 3, sm: 6 }}>
            <BlankCard>
              <CardContent sx={{ p: "32px" }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Skeleton variant="text" width={120} height={32} />
                  <Skeleton variant="rectangular" width={60} height={24} sx={{ ml: 1, borderRadius: "8px" }} />
                </Box>
                <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
                <Divider />
                <Stack mt={4} direction="row" gap="8px" alignItems="end">
                  <Skeleton variant="text" width={60} height={40} />
                  <Skeleton variant="text" width={40} height={30} />
                  <Skeleton variant="text" width={40} height={20} />
                </Stack>
                <Stack my={4} gap="12px">
                  {featureList.map((f) => (
                    <Box key={f.key} display="flex" alignItems="center" gap="8px">
                      <Skeleton variant="circular" width={20} height={20} />
                      <Skeleton variant="text" width={100} height={20} />
                    </Box>
                  ))}
                </Stack>
                <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
              </CardContent>
            </BlankCard>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {planData.map((plan) => {
          const { id, name, descriptionTh, descriptionEn, price, isPopular, isTrial, features } = plan;
          const isTrialLicense = isTrial && !hasReceivedTrial;
          return (
            <Grid
              key={id}
              size={{
                xs: 12,
                lg: 3,
                sm: 6,
              }}
            >
              <BlankCard>
                <CardContent sx={{ p: "32px" }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h4" fontSize="20px" fontWeight={600}>
                      {name}
                    </Typography>
                    {isPopular ? (
                      <Chip
                        label="Popular"
                        size="small"
                        sx={{
                          ml: "6px",
                          borderRadius: "8px",
                          color: "primary.main",
                          backgroundColor: "rgba(93, 135, 255, 0.15)",
                        }}
                      />
                    ) : null}
                  </Box>
                  <Typography fontSize="13px" mb={4}>
                    {I18nString(language, descriptionTh, descriptionEn)}
                  </Typography>
                  <Divider />
                  <Stack mt={4} direction="row" gap="8px" alignItems="end">
                    <Typography
                      variant="h4"
                      fontSize="40px"
                      fontWeight={700}
                      sx={isTrialLicense ? { textDecoration: "line-through", color: "text.disabled" } : {}}
                    >
                      ฿{price}
                    </Typography>
                    {isTrialLicense && (
                      <Typography variant="h4" fontSize="30px" fontWeight={700}>
                        ฟรี
                      </Typography>
                    )}
                    <Typography variant="body2" fontSize="14px">
                      / เดิอน
                    </Typography>
                  </Stack>
                  <Stack my={4} gap="12px">
                    {featureList.map((feature) => {
                      const { key, labelTh, labelEn } = feature;
                      return (
                        <Box key={key} display="flex" alignItems="center" gap="8px">
                          <FeatureIcon checked={features[key]} />
                          <Typography fontSize="14px" fontWeight={500}>
                            {I18nString(language, labelTh, labelEn)}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                  <Button fullWidth variant="contained" size="large" onClick={onClickPlan}>
                    {isTrialLicense ? "ทดลองใช้งานฟรี 7 วัน" : "Purchase Now"}
                  </Button>
                </CardContent>
              </BlankCard>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default PricingCard;
