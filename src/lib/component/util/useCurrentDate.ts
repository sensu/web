import { useState, useEffect, useMemo } from "/vendor/react";

export const useCurrentDate = (interval: number = 1000, percision: number = 1) => {
  const getT = useMemo(() => () => {
    const ts = new Date().getTime();
    return ts - (ts % percision);
  }, [percision]);
  const [t, setT] = useState(getT());

  useEffect(() => {
    const id = setInterval(() => setT(getT()), interval);
    return () => clearInterval(id);
  }, [interval, getT]);

  return new Date(t);
};
