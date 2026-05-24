"use client";
import { styled, useTheme } from "@mui/material/styles";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useNsfw } from "@/common/contexts/NsfwContext";
import NotificationBell from "@/common/components/shared/NotificationBell";
import Profile from "@/common/components/shared/Profile";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import BaseAppBar from "@/common/components/base/BaseAppBar";
import { IconSun, IconMoon } from "@tabler/icons-react";

const Header = () => {
  const { appearance, updateAppearance } = useProfile();
  const { showNsfw, toggleNsfw } = useNsfw();
  const theme = useTheme();
  const isDark = appearance.activeMode === "dark";

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  return (
    <BaseAppBar position="sticky" color="default">
      <ToolbarStyled>
        <Stack direction="row" alignItems="center" spacing={1} ml="auto">

          {/* NSFW toggle */}
          <Chip
            label="🔞 NSFW"
            size="small"
            onClick={toggleNsfw}
            color={showNsfw ? "error" : "default"}
            variant={showNsfw ? "filled" : "outlined"}
            sx={{ fontWeight: 600, cursor: "pointer", fontSize: 12 }}
          />

          {/* Dark / Light mode */}
          <Tooltip title={isDark ? "Light mode" : "Dark mode"}>
            <IconButton
              size="small"
              onClick={() => updateAppearance({ activeMode: isDark ? "light" : "dark" })}
              sx={{ color: "text.secondary" }}
            >
              {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
            </IconButton>
          </Tooltip>

          <NotificationBell />
          <Profile />
        </Stack>
      </ToolbarStyled>
    </BaseAppBar>
  );
};

export default Header;
