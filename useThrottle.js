import { useRef, useEffect } from "react";

const useThrottle = (callback, delay) => {
  const lastTimeRef = useRef(0);
  const callbackRef = useRef(callback);
  const timeoutRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttledFunction = (...args) => {
    const now = Date.now();
    const remainTime = delay - (now - lastTimeRef.current);

    if (remainTime <= 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      lastTimeRef.current = now;
      callbackRef.current(...args);
    } else if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        lastTimeRef.current = Date.now();
        timeoutRef.current = null;
        callbackRef.current(...args);
      }, remainTime);
    }
  };
  return throttledFunction;
};

export default useThrottle;
