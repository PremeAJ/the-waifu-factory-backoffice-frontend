import { Box, Skeleton, Typography } from "@mui/material";
import { I18nString } from "@/common/utils/i18n/I18nString";
import { ProductProvider } from "@/context/Ecommercecontext/index";
import { styled } from "@mui/material/styles";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useSession } from "next-auth/react";
import AppShortcut from "./AppShortcu";
import Language from "@/common/components/shared/Language";
import Notifications from "./Notification";
import Profile from "@/common/components/shared/Profile";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import useIsMobile from "@/common/utils/state/isMobile";
import BaseAppBar from "@/common/components/base/BaseAppBar";

const Header = () => {
  const { firstName } = useSession().data?.profile || {};
  const { roleNameTh, roleNameEn } = useProfile().activeCompany || {};
  const { isLanguage } = useProfile().appearance || {};
  const isMobile = useIsMobile();
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));
  return (
    <ProductProvider>
      <BaseAppBar position="sticky" color="default">
        <ToolbarStyled>
          <Box flexGrow={1} />
          <Stack spacing={1} direction="row" alignItems="center">
            {/* <Language /> */}
            <Notifications />
            {!isMobile && <AppShortcut />}
            <Box display="flex" flexDirection="column" alignItems="flex-end" mr={1} sx={{ cursor: "default" }}>
              {firstName ? (
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                  {firstName}
                </Typography>
              ) : (
                <Skeleton variant="text" width={100} />
              )}
              {roleNameTh || roleNameEn ? (
                <Typography variant="caption" color="text.secondary" noWrap>
                  {I18nString(isLanguage, roleNameTh, roleNameEn)}
                </Typography>
              ) : (
                <Skeleton variant="text" width={100} />
              )}
            </Box>
            <Profile />
          </Stack>
        </ToolbarStyled>
      </BaseAppBar>
    </ProductProvider>
  );
};
export default Header;
