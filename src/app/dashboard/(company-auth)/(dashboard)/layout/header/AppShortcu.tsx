import { IconGridDots } from "@tabler/icons-react";
import { IconButton } from "@mui/material";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";

const AppShortcut = () => {
  const { appShortcutisOpen, openAppShortcut } = useSidebarState();

  return (
    <IconButton
      size="large"
      color="inherit"
      onClick={openAppShortcut}
      sx={{ ...(appShortcutisOpen && { color: "primary.main" }) }}
    >
      <IconGridDots size="21" stroke="1.5" />
    </IconButton>
  );
};

export default AppShortcut;