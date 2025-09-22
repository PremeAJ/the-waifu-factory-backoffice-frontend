"use client";
import { IconChevronDown } from "@tabler/icons-react";
import { PageUrl } from "@/common/constants/pageUrl";
import { stat } from "fs";
import { UserContext } from "@/common/contexts/UserContext";
import { useSession } from "next-auth/react";
import AppLinks from "@/app/dashboard/layout/header/AppLinks";
import BaseButton from "@/common/components/base/BaseButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import DemosDD from "../../../components/landingpage/header/DemosDD";
import Logo from "@/common/components/shared/Logo";
import QuickLinks from "@/app/dashboard/layout/header/QuickLinks";
import React, { useContext, useState } from "react";
import Stack from "@mui/material/Stack";

const MobileSidebar = () => {
  const [toggle, setToggle] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const { user, loading } = useContext(UserContext);
  const { data: session, status } = useSession();

  return (
    <>
      <Box px={3}>
        <Logo size="small"/>
      </Box>
      <Box p={3}>
        <Stack direction="column" spacing={2}>
          {/* <Button
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
          )} */}

          <BaseButton
            label="Documentation"
            variant="text"
            color="inherit"
            href="#"
            sx={{
              justifyContent: "start",
            }}
          />
          <BaseButton
            label="Support"
            variant="text"
            color="inherit"
            href="https://adminmart.com/support"
            sx={{
              justifyContent: "start",
            }}
          />
          {!session && <BaseButton variant="contained" label="Login" href={PageUrl.AUTH_SIGN_IN} />}
        </Stack>
      </Box>
    </>
  );
};

export default MobileSidebar;
