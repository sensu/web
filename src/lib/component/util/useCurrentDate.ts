import { useState, useEffect } from "/vendor/react";

export const useCurrentDate = (interval: number = 1000) => {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), interval);
    return () => clearInterval(id);
  }, [interval]);

  return t;
};
