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
      // เพิ่ม class เฉพาะเวลา keyboard เปิด (optional)
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

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (vv) {
        vv.removeEventListener("resize", handler);
        vv.removeEventListener("scroll", handler);
      } else {
        window.removeEventListener("resize", handler);
        window.removeEventListener("orientationchange", handler);
      }
      document.documentElement.style.removeProperty("--keyboard-offset");
      document.documentElement.classList.remove("keyboard-open");
    };
  }, []);
}