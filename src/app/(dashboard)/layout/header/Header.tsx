import { styled } from "@mui/material/styles";
import { useProfile } from "@/common/contexts/ProfileContext";
import NotificationBell from "@/common/components/shared/NotificationBell";
import Profile from "@/common/components/shared/Profile";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import BaseAppBar from "@/common/components/base/BaseAppBar";

const Header = () => {
  const { } = useProfile().appearance || {};

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  return (
    <BaseAppBar position="sticky" color="default">
      <ToolbarStyled>
        <Stack direction="row" alignItems="center" spacing={1} ml="auto">
          <NotificationBell />
          <Profile />
        </Stack>
      </ToolbarStyled>
    </BaseAppBar>
  );
};

export default Header;
