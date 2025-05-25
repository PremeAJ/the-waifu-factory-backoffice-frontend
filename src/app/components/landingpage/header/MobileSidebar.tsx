"use client";
import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";
import { IconChevronDown } from "@tabler/icons-react";
import Logo from "@/app/dashboard/(Layout)/layout/shared/logo/Logo";
import DemosDD from "./DemosDD";
import AppLinks from "@/app/dashboard/(Layout)/layout/vertical/header/AppLinks";
import QuickLinks from "@/app/dashboard/(Layout)/layout/vertical/header/QuickLinks";
import { AuthContext } from "@/app/context/AuthContext";
import { UserContext } from "@/app/context/UserContext";

//!

const MobileSidebar = () => {
  const [toggle, setToggle] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const { user, loading } = useContext(UserContext);

  return (
    <>
      <Box px={3}>
        <Logo />
      </Box>
      <Box p={3}>
        <Stack direction="column" spacing={2}>
          <Button
            color="inherit"
            onClick={() => setToggle(!toggle)}
            endIcon={<IconChevronDown width={20} />}
            sx={{
              justifyContent: "space-between",
            }}
          >
            Demos
          </Button>
          {toggle && (
            <Collapse in={toggle}>
              <Box m="-21px">
                <Box ml={1}>
                  <DemosDD />
                </Box>
              </Box>
            </Collapse>
          )}

          <Button
            color="inherit"
            onClick={() => setToggle2(!toggle2)}
            endIcon={<IconChevronDown width={20} />}
            sx={{
              justifyContent: "space-between",
            }}
          >
            Pages
          </Button>
          {toggle2 && (
            <Collapse in={toggle2}>
              <Box overflow="hidden" ml={1}>
                <AppLinks />
                <QuickLinks />
              </Box>
            </Collapse>
          )}
          <Button
            color="inherit"
            href="#"
            sx={{
              justifyContent: "start",
            }}
          >
            Documentation
          </Button>
          <Button
            color="inherit"
            href="https://adminmart.com/support"
            sx={{
              justifyContent: "start",
            }}
          >
            Support
          </Button>
          {user && !loading ? null : (
            <Button color="primary" variant="contained" href="/auth/login">
              Login
            </Button>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default MobileSidebar;
