"use client";
import React, { useEffect, useState } from "react";
import { IconArrowUp } from "@tabler/icons-react";
import BaseFab from "../base/BaseFab";

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

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) setShow(true);
  }, [isVisible]);

  const handleExited = () => setShow(false);

  return (
    <>
      {show && (
        <BaseFab
          fadeDirection="up"
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 100 }}
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
