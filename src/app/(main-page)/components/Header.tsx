"use client";
import { IconMenu2 } from "@tabler/icons-react";
import { styled } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Language from "@/common/components/shared/Language";
import Logo from "@/common/components/shared/Logo";
import MobileSidebar from "./MobileSidebar";
import Navigations from "./Navigations";
import Profile from "@/common/components/shared/Profile";
import React from "react";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import useIsMobile from "@/common/utils/state/isMobile";

const Header = () => {
  const { data: session, status } = useSession();
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    justifyContent: "center",
    [theme.breakpoints.up("lg")]: {
      minHeight: "80px",
    },
    backgroundColor: theme.palette.background.default,
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    paddingLeft: "0 !important",
    paddingRight: "0 !important",
    color: theme.palette.text.secondary,
  }));

  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBarStyled position="sticky" elevation={8}>
      <Container maxWidth="lg">
        <ToolbarStyled>
          <Logo size="small"/>
          <Box flexGrow={1} />
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerOpen}
            >
              <IconMenu2 size="20" />
            </IconButton>
          ) : (
            <Stack spacing={1} direction="row" alignItems="center">
              <Navigations />
            </Stack>
          )}
          <Box ml={2} display="flex" alignItems="center">
            <Profile />
            {session ? null : <Language />}
          </Box>
        </ToolbarStyled>
      </Container>
      <Drawer
        anchor="left"
        open={open}
        variant="temporary"
        onClose={toggleDrawer(false)}
        slotProps={{
          paper: {
            sx: {
              width: 270,
              border: "0 !important",
              boxShadow: (theme) => theme.shadows[8],
            },
          },
        }}
      >
        <MobileSidebar />
      </Drawer>
    </AppBarStyled>
  );
};

export default Header;
