import { createContext, useContext, useState, ReactNode } from "react";

interface AppShortcutContextProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const AppShortcutContext = createContext<AppShortcutContextProps>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export const AppShortcutProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <AppShortcutContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </AppShortcutContext.Provider>
  );
};

export const useAppShortcut = () => useContext(AppShortcutContext);