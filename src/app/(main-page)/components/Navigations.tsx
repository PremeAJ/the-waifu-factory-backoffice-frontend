"use client";
import { Grid } from "@mui/material";
import { IconChevronDown } from "@tabler/icons-react";
import { styled } from "@mui/material/styles";
import { UserContext } from "@/common/contexts/UserContext";
import { useTranslation } from "react-i18next";
import AppLinks from "@/app/dashboard/layout/header/AppLinks";
import BaseButton from "@/common/components/base/BaseButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DemosDD from "../../../components/landingpage/header/DemosDD";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import QuickLinks from "@/app/dashboard/layout/header/QuickLinks";
import React, { useContext, useState } from "react";
import { useSession } from "next-auth/react";

const Navigations = () => {
  const { t } = useTranslation();
  const { user, loading } = useContext(UserContext);
  const { data: session, status } = useSession();
  const { profile } = session || {};
  // If you need profile, access it like: session?.profile
  const StyledButton = styled(Button)(({ theme }) => ({
    fontSize: "16px",
    color: theme.palette.text.secondary,
  }));

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [open2, setOpen2] = useState(false);

  const handleOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  return (
    <>
      <StyledButton color="inherit" variant="text" href="/">
        หน้าแรก
      </StyledButton>
      <Box>
        <StyledButton
          color="inherit"
          variant="text"
          onMouseEnter={handleOpen2}
          onMouseLeave={handleClose2}
          sx={{
            color: open2 ? "primary.main" : (theme) => theme.palette.text.secondary,
          }}
          endIcon={<IconChevronDown size="15" style={{ marginLeft: "-5px", marginTop: "2px" }} />}
        >
          ผลิตภัณฑ์ของเรา
        </StyledButton>
        {open2 && (
          <Paper
            onMouseEnter={handleOpen2}
            onMouseLeave={handleClose2}
            sx={{
              position: "absolute",
              left: "0",
              right: "0",
              top: "55px",
              width: "850px",
              margin: "0 auto",
            }}
          >
            <Grid container>
              <Grid
                display="flex"
                size={{
                  sm: 8,
                }}
              >
                <Box p={4} pr={0} pb={3}>
                  <AppLinks />
                </Box>
                <Divider orientation="vertical" />
              </Grid>
              <Grid
                size={{
                  sm: 4,
                }}
              >
                <Box p={4}>
                  <QuickLinks />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
      <StyledButton
        color="inherit"
        variant="text"
        aria-expanded={open ? "true" : undefined}
        sx={{
          color: open ? "primary.main" : (theme) => theme.palette.text.secondary,
        }}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        endIcon={<IconChevronDown size="15" style={{ marginLeft: "-5px", marginTop: "2px" }} />}
      >
        Demos
      </StyledButton>
      {open && (
        <Paper
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          sx={{
            position: "absolute",
            left: "0",
            right: "0",
            top: "55px",
            maxWidth: "1200px",
            width: "100%",
          }}
        >
          <DemosDD />
        </Paper>
      )}
      <StyledButton color="inherit" variant="text" href="/pricing">
        ราคา
      </StyledButton>
      <StyledButton color="inherit" variant="text" href="/">
        รู้จักเรา
      </StyledButton>
      {!session && (
        <>
          <BaseButton label={"เข้าสู่ระบบ"} href="/auth/sign-in" fullWidth={false} variant="outlined" />
          <BaseButton label={"เริ่มต้นใช้งาน"} href="/auth/sign-up" fullWidth={false} />
        </>
      )}
    </>
  );
};

export default Navigations;
