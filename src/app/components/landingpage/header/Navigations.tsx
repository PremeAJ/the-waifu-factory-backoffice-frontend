"use client";
import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { Grid } from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { IconChevronDown } from "@tabler/icons-react";
import AppLinks from "@/app/dashboard/(Layout)/layout/vertical/header/AppLinks";
import QuickLinks from "@/app/dashboard/(Layout)/layout/vertical/header/QuickLinks";
import DemosDD from "./DemosDD";
import { useTranslation } from "react-i18next";
import { UserContext } from "@/app/context/UserContext";
import BaseButton from "../../forms/theme-elements/BaseButton";

const Navigations = () => {
  const { t } = useTranslation();
  const { user, loading } = useContext(UserContext);
  const StyledButton = styled(Button)(({ theme }) => ({
    fontSize: "16px",
    color: theme.palette.text.secondary,
  }));

  // demos
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // pages

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
      {loading ? null : user ? null : <BaseButton label={t("Page.Main.Login")} href="/auth/login" fullWidth={false} />}
    </>
  );
};

export default Navigations;
