"use client";
import React, { useEffect, useState } from "react";
import { IconArrowUp } from "@tabler/icons-react";
import BaseFab from "@/components/base/BaseFab";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
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

  return (
    <>
      {isVisible ? (
        <BaseFab
          fadeDirection="up"
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 9999 }}
        >
          <IconArrowUp />
        </BaseFab>
      ) : null}
    </>
  );
};

export default ScrollToTopButton;
