import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarStateContextProps {
  appShortcutisOpen: boolean;
  openAppShortcut: () => void;
  closeAppShortcut: () => void;
  toggleAppShortcut: () => void;
}

const SidebarStateContext = createContext<SidebarStateContextProps>({
  appShortcutisOpen: false,
  openAppShortcut: () => {},
  closeAppShortcut: () => {},
  toggleAppShortcut: () => {},
});

export const SidebarStateProvider = ({ children }: { children: ReactNode }) => {
  const [appShortcutisOpen, setAppShortcutIsOpen] = useState(false);
  const openAppShortcut = () => setAppShortcutIsOpen(true);
  const closeAppShortcut = () => setAppShortcutIsOpen(false);
  const toggleAppShortcut = () => setAppShortcutIsOpen((prev) => !prev);

  return (
    <SidebarStateContext.Provider value={{ appShortcutisOpen, openAppShortcut, closeAppShortcut, toggleAppShortcut }}>
      {children}
    </SidebarStateContext.Provider>
  );
};

export const useSidebarState = () => useContext(SidebarStateContext);


