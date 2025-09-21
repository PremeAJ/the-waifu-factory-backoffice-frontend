import { Box, Typography } from "@mui/material";
import { ProductProvider } from "@/context/Ecommercecontext/index";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import { UserContext } from "@/common/contexts/UserContext";
import AppBarStyled from "@/common/components/shared/AppBarStyled";
import Language from "@/common/components/shared/Language";
import Profile from "@/common/components/shared/Profile";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Notifications from "./Notification";
import AppShortcut from "./AppShortcu";
import useIsMobile from "@/common/utils/state/isMobile";
const Header = () => {
  const { loading, user } = useContext(UserContext);
  const { firstName, companies } = user || {};
  const { companyUsers } = companies || {};
  const { roles } = companyUsers?.[0] || {};
  const { nameTh: roleNameTh, nameEn: roleNameEN } = roles || {};
  const isMobile = useIsMobile()
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));
  return (
    <ProductProvider>
      <AppBarStyled position="sticky" color="default">
        <ToolbarStyled>
          <Box flexGrow={1} />
          <Stack spacing={1} direction="row" alignItems="center">
            <Language />
            <Notifications />
            {!isMobile && <AppShortcut />}
            <Box display="flex" flexDirection="column" alignItems="flex-end" mr={1} sx={{ cursor: "default" }}>
              <Typography variant="subtitle1" fontWeight="bold" noWrap>
                {firstName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {roleNameTh}
              </Typography>
            </Box>
            <Profile loading={loading || !user} />
          </Stack>
        </ToolbarStyled>
      </AppBarStyled>
    </ProductProvider>
  );
};
export default Header;
