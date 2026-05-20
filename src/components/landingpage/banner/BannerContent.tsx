"use client";
import { IconRocket } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { PageUrl } from "@/common/constants/pageUrl";
import { Theme } from "@mui/material/styles";
import { useWaifuUser } from "@/common/contexts/WaifuUserContext";
import BaseButton from "@/common/components/base/BaseButton/BaseButton";
import Box from "@mui/material/Box";
import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

const BannerContent = () => {
  const { user } = useWaifuUser();
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  return (
    <Box mt={lgDown ? 8 : 0}>
      <motion.div
        initial={{ opacity: 0, translateY: 550 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 30,
        }}
      >
        <Typography variant="h6" display={"flex"} gap={1} mb={2}>
          <Typography color={"secondary"}>
            <IconRocket size={"21"} />
          </Typography>
          Kick start your project with
        </Typography>

        <Typography
          variant="h1"
          fontWeight={900}
          sx={{
            fontSize: {
              md: "50px",
            },
            lineHeight: {
              md: "55px",
            },
          }}
        >
          ระบบ All-in-one สำหรับธุรกิจยุคใหม่ที่
          <Typography component={"span"} variant="inherit" color={"primary"}>
            &nbsp;ครบจบในที่เดียว <br />
          </Typography>
          ทั้ง POS, CRM, HRM และคลังสินค้า
        </Typography>
      </motion.div>
      <Box pt={4} pb={3}>
        <motion.div
          initial={{ opacity: 0, translateY: 550 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 30,
            delay: 0.2,
          }}
        >
          <Typography variant="h5" fontWeight={300}>
            เชื่อมโยงทุกการจัดการธุรกิจ ทั้งหน้าร้าน ลูกค้า พนักงาน และสต็อกสินค้า ใช้งานง่าย ครอบคลุมทุกฟังก์ชัน พร้อมรองรับการเติบโตของคุณ
          </Typography>
        </motion.div>
      </Box>
      <motion.div
        initial={{ opacity: 0, translateY: 550 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 30,
          delay: 0.4,
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={3}>
          {!user && <BaseButton label="Login" href={PageUrl.AUTH_SIGN_IN} fullWidth={false} sx={{ padding: "13px 48px" }} />}
          <BaseButton variant="outlined" label="Live Preview" href="#demos" fullWidth={false} sx={{ padding: "13px 48px" }} />
        </Stack>
      </motion.div>
    </Box>
  );
};

export default BannerContent;
