"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarStateContextProps {
  appShortcutisOpen: boolean;
  isMobileSidebar: boolean;
  openAppShortcut: () => void;
  closeAppShortcut: () => void;
  toggleAppShortcut: () => void;
  setIsMobileSidebar: (v: boolean) => void;
  openSwitchCompany: boolean;
  setOpenSwitchCompany: (v: boolean) => void;
}

const SidebarStateContext = createContext<SidebarStateContextProps>({
  appShortcutisOpen: false,
  isMobileSidebar: false,
  openAppShortcut: () => {},
  closeAppShortcut: () => {},
  toggleAppShortcut: () => {},
  setIsMobileSidebar: () => {},
  openSwitchCompany: false,
  setOpenSwitchCompany: () => {},
});

export const SidebarStateProvider = ({ children }: { children: ReactNode }) => {
  const [appShortcutisOpen, setAppShortcutIsOpen] = useState<boolean>(false);
  const [isMobileSidebar, setIsMobileSidebar] = useState<boolean>(false);
  const [openSwitchCompany, setOpenSwitchCompany] = useState<boolean>(false);
  const openAppShortcut = () => setAppShortcutIsOpen(true);
  const closeAppShortcut = () => setAppShortcutIsOpen(false);
  const toggleAppShortcut = () => setAppShortcutIsOpen((prev) => !prev);

  return (
    <SidebarStateContext.Provider
      value={{ appShortcutisOpen, openAppShortcut, closeAppShortcut, toggleAppShortcut, isMobileSidebar, setIsMobileSidebar, openSwitchCompany, setOpenSwitchCompany }}
    >
      {children}
    </SidebarStateContext.Provider>
  );
};

export const useSidebarState = () => useContext(SidebarStateContext);
