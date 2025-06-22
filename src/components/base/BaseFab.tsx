import React from "react";
import Fab, { FabProps } from "@mui/material/Fab";
import { keyframes } from "@emotion/react";

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

export interface BaseFabProps extends FabProps {
  children: React.ReactNode;
  sx?: object;
  animation?: boolean;
  fadeDirection?: FadeDirection;
}

const BaseFab: React.FC<BaseFabProps> = ({
  children,
  sx,
  animation = true,
  fadeDirection = "up",
  ...rest
}) => (
  <Fab
    size="medium"
    color="primary"
    {...rest}
    sx={{
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      backgroundColor: (theme) => theme.palette.primary.main + "CC",
      border: "1px solid rgba(255,255,255,0.3)",
      boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
      color: "#fff",
      "&:hover": {
        backgroundColor: (theme) => theme.palette.primary.main,
      },
      animation: animation
        ? `${fadeInMap[fadeDirection]} 0.5s cubic-bezier(0.4,0,0.2,1)`
        : undefined,
      ...sx,
    }}
  >
    {children}
  </Fab>
);

export default BaseFab;
