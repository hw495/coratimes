import { useState, useEffect } from "react";

export function useBreakpoint() {
  const getState = () => ({
    isMobile:  window.innerWidth < 768,
    isTablet:  window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
    width:     window.innerWidth,
  });
  const [bp, setBp] = useState(getState);
  useEffect(() => {
    const update = () => setBp(getState());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
}
