"use client";
import { useEffect } from "react";

export default function useVisualViewport() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let rafId: number | null = null;
    const vv = (window as any).visualViewport;

    const update = () => {
      const visibleHeight = vv ? vv.height : window.innerHeight;
      const keyboardHeight = Math.max(0, window.innerHeight - visibleHeight - (vv?.offsetTop ?? 0));
      // ตั้งตัวแปร CSS
      document.documentElement.style.setProperty("--dvh", `${visibleHeight}px`);
      document.documentElement.style.setProperty("--keyboard-offset", `${keyboardHeight}px`);
      if (keyboardHeight > 0) document.documentElement.classList.add("keyboard-open");
      else document.documentElement.classList.remove("keyboard-open");
    };

    const handler = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    handler();
    if (vv) {
      vv.addEventListener("resize", handler);
      vv.addEventListener("scroll", handler);
    } else {
      window.addEventListener("resize", handler);
      window.addEventListener("orientationchange", handler);
    }

    // ----- NEW: focus handling to ensure inputs are visible and restore on blur -----
    let savedScrollY = 0;
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.getAttribute("contenteditable") === "true") {
        savedScrollY = window.scrollY;
        // small timeout to allow keyboard/visualViewport to settle
        setTimeout(() => {
          try {
            // prefer scrollIntoView with center to avoid hidden by keyboard
            (target as HTMLElement).scrollIntoView({ block: "center", behavior: "smooth" });
          } catch { /* ignore */ }
        }, 300);
      }
    };
    const onFocusOut = () => {
      // restore scroll after keyboard closed
      setTimeout(() => {
        window.scrollTo({ top: savedScrollY, behavior: "smooth" });
      }, 250);
    };

    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (vv) {
        vv.removeEventListener("resize", handler);
        vv.removeEventListener("scroll", handler);
      } else {
        window.removeEventListener("resize", handler);
        window.removeEventListener("orientationchange", handler);
      }
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
      document.documentElement.style.removeProperty("--keyboard-offset");
      document.documentElement.classList.remove("keyboard-open");
    };
  }, []);
}