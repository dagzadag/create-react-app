import { useRef, useEffect, useCallback } from "react";

export default function useLongPress(callback, delay = 500) {
  const pressTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (pressTimer.current) clearTimeout(pressTimer.current);
    };
  }, []);

  const startPress = useCallback(() => {
    pressTimer.current = setTimeout(callback, delay);
  }, [callback, delay]);

  const cancelPress = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  return {
    onMouseDown: startPress,
    onMouseUp: cancelPress,
    onMouseLeave: cancelPress,
    onTouchStart: startPress,
    onTouchEnd: cancelPress,
  };
}
