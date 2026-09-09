import { useEffect, useRef, useState } from "react";

// Simple mobile pull-to-refresh gesture. Activates only when the page is
// scrolled to the very top and the user drags downward, then calls onRefresh.
export function usePullToRefresh(onRefresh, { threshold = 70, max = 100 } = {}) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const startY = useRef(null);
  const active = useRef(false);
  const pullRef = useRef(0);
  const refreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);
  useEffect(() => {
    refreshingRef.current = refreshing;
  }, [refreshing]);

  useEffect(() => {
    const onTouchStart = (e) => {
      if (window.scrollY > 0 || refreshingRef.current) {
        startY.current = null;
        return;
      }
      startY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      if (startY.current == null || refreshingRef.current) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0 && window.scrollY <= 0) {
        active.current = true;
        const pd = Math.min(delta * 0.5, max);
        pullRef.current = pd;
        setPullDistance(pd);
        if (delta > 10) e.preventDefault();
      }
    };

    const onTouchEnd = async () => {
      if (!active.current) {
        startY.current = null;
        return;
      }
      active.current = false;
      startY.current = null;
      if (pullRef.current >= threshold) {
        setRefreshing(true);
        setPullDistance(0);
        try {
          await onRefreshRef.current?.();
        } finally {
          setRefreshing(false);
          pullRef.current = 0;
        }
      } else {
        setPullDistance(0);
        pullRef.current = 0;
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [threshold, max]);

  return { pullDistance, refreshing };
}