"use client";
import { hideButtonRoute } from "./hideButton";
import { IconArrowUp } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import BaseFab from "../../base/BaseFab";
import React, { useEffect, useState, useMemo } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const pathname = usePathname();
  const isHiddenByRoute = useMemo(() => {
    if (!pathname) return false;
    return hideButtonRoute.some((cfg) => {
      const p = cfg.pathname;
      if (p.endsWith("/*")) {
        const prefix = p.slice(0, -2);
        return pathname === prefix || pathname.startsWith(prefix + "/");
      }
      return pathname === p;
    });
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleVisibility = () => {
    if (window.pageYOffset > 2000) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) setShow(true);
  }, [isVisible]);

  const handleExited = () => setShow(false);

  return (
    <>
      {/* hide by route config */}
      {show && !isHiddenByRoute && (
        <BaseFab
          fadeDirection="up"
          color="primary"
          onClick={scrollToTop}
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          open={isVisible}
          onExited={handleExited}
        >
          <IconArrowUp />
        </BaseFab>
      )}
    </>
  );
};

export default ScrollToTopButton;
