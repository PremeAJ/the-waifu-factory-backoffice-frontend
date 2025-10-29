import { keyframes } from "@emotion/react";
import Fab, { FabProps } from "@mui/material/Fab";
import React, { useEffect, useState } from "react";
import useIsMobile from "@/common/utils/state/isMobile";

type FadeDirection = "up" | "down" | "left" | "right";

const fadeInMap: Record<FadeDirection, ReturnType<typeof keyframes>> = {
  up: keyframes`
    from { opacity: 0; transform: translateY(24px) scale(0.8);}
    to { opacity: 1; transform: translateY(0) scale(1);}
  `,
  down: keyframes`
    from { opacity: 0; transform: translateY(-24px) scale(0.8);}
    to { opacity: 1; transform: translateY(0) scale(1);}
  `,
  left: keyframes`
    from { opacity: 0; transform: translateX(-24px) scale(0.8);}
    to { opacity: 1; transform: translateX(0) scale(1);}
  `,
  right: keyframes`
    from { opacity: 0; transform: translateX(24px) scale(0.8);}
    to { opacity: 1; transform: translateX(0) scale(1);}
  `,
};

const fadeOutMap: Record<FadeDirection, ReturnType<typeof keyframes>> = {
  up: keyframes`
    from { opacity: 1; transform: translateY(0) scale(1);}
    to { opacity: 0; transform: translateY(24px) scale(0.8);}
  `,
  down: keyframes`
    from { opacity: 1; transform: translateY(0) scale(1);}
    to { opacity: 0; transform: translateY(-24px) scale(0.8);}
  `,
  left: keyframes`
    from { opacity: 1; transform: translateX(0) scale(1);}
    to { opacity: 0; transform: translateX(-24px) scale(0.8);}
  `,
  right: keyframes`
    from { opacity: 1; transform: translateX(0) scale(1);}
    to { opacity: 0; transform: translateX(24px) scale(0.8);}
  `,
};

export interface BaseFabProps extends FabProps {
  children: React.ReactNode;
  sx?: object;
  animation?: boolean;
  fadeDirection?: FadeDirection;
  open?: boolean;
  onExited?: () => void;
}

const BaseFab: React.FC<BaseFabProps> = ({ children, sx, animation = true, fadeDirection = "up", open = true, onExited, ...rest }) => {
  const [visible, setVisible] = useState(open);
  const [exiting, setExiting] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (open) {
      setVisible(true);
      setExiting(false);
    } else if (visible) {
      setExiting(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setExiting(false);
        onExited?.();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [open, visible, onExited]);

  if (!visible) return null;

  return (
    <Fab
      // size={isMobile ? "large" : "medium"}
      size='large'
      color="primary"
      {...rest}
      sx={{
        backdropFilter: "blur(5px)",
        zIndex: 1000,
        WebkitBackdropFilter: "blur(5px)",
        backgroundColor: (theme) => theme.palette.primary.main,
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
        color: "#fff",
        // scale animation like BaseButton
        transition: "all 0.18s",
        "&:hover": {
          backgroundColor: (theme) => theme.palette.primary.main,
          transform: "scale(1.07)",
        },
        "&:active": {
          transform: "scale(0.96)",
        },
        animation: animation ? `${exiting ? fadeOutMap[fadeDirection] : fadeInMap[fadeDirection]} 0.5s cubic-bezier(0.4,0,0.2,1)` : undefined,
        ...sx,
      }}
    >
      {children}
    </Fab>
  );
};

export default BaseFab;
