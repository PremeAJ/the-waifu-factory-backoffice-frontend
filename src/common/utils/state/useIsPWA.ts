import { useEffect, useState } from "react";

/**
 * runtime check for PWA / standalone / installed-app contexts
 */
export const getIsPWA = (): boolean => {
  if (typeof window === "undefined") return false;
  // iOS standalone
  if ((navigator as any).standalone) return true;
  // display-mode (modern browsers)
  if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
  if (window.matchMedia && window.matchMedia("(display-mode: fullscreen)").matches) return true;
  if (window.matchMedia && window.matchMedia("(display-mode: minimal-ui)").matches) return true;
  // Android WebAPK/referrer hint
  if (document.referrer && document.referrer.startsWith("android-app://")) return true;
  return false;
};

const useIsPWA = (): boolean => {
  const [isPwa, setIsPwa] = useState<boolean>(() => getIsPWA());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia?.("(display-mode: standalone)");
    const update = () => setIsPwa(getIsPWA());

    if (mq) {
      if (mq.addEventListener) mq.addEventListener("change", update);
      else mq.addListener(update as any);
    }

    window.addEventListener("appinstalled", update);
    // focus can help detect changes on iOS after user adds to home
    window.addEventListener("focus", update);

    return () => {
      if (mq) {
        if (mq.removeEventListener) mq.removeEventListener("change", update);
        else mq.removeListener(update as any);
      }
      window.removeEventListener("appinstalled", update);
      window.removeEventListener("focus", update);
    };
  }, []);

  return isPwa;
};

export default useIsPWA;