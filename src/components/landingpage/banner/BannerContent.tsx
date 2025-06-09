"use client";
import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";
import { IconRocket } from "@tabler/icons-react";

// third party
import { motion } from "framer-motion";
import { UserContext } from "@/context/UserContext";

const StyledButton = styled(Button)(() => ({
  padding: "13px 48px",
  fontSize: "16px",
}));

const BannerContent = () => {
  const { user } = useContext(UserContext);
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
            เชื่อมโยงทุกการจัดการธุรกิจ ทั้งหน้าร้าน ลูกค้า พนักงาน และสต็อกสินค้า
            ใช้งานง่าย ครอบคลุมทุกฟังก์ชัน พร้อมรองรับการเติบโตของคุณ
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
          {!user && (
            <StyledButton
              variant="contained"
              color="primary"
              href="/auth/login"
            >
              Login
            </StyledButton>
          )}

          <StyledButton variant="outlined" href="#demos">
            Live Preview
          </StyledButton>
        </Stack>
      </motion.div>
    </Box>
  );
};

export default BannerContent;
