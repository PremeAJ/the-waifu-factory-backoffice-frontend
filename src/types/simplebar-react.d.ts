declare module "simplebar-react" {
  import React from "react";

  interface SimpleBarProps extends React.HTMLAttributes<HTMLDivElement> {
    scrollableNodeProps?: React.HTMLAttributes<HTMLDivElement>;
    autoHide?: boolean;
    forceVisible?: boolean | "x" | "y";
    clickOnTrack?: boolean;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    ref?: React.Ref<{ getScrollElement: () => HTMLElement | null }>;
  }

  const SimpleBar: React.ForwardRefExoticComponent<
    SimpleBarProps & React.RefAttributes<{ getScrollElement: () => HTMLElement | null }>
  >;
  export default SimpleBar;
}

declare module "simplebar-react/dist/simplebar.min.css" {}
