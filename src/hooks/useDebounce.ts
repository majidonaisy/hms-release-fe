import { useState, useEffect, useRef } from 'react';

export const useDebounce = (value: string, delay: number) => {
 const [debouncedValue, setDebouncedValue] = useState(value);
  const isFirstSearch = useRef(true);
  const lastExecutedValue = useRef("");

  useEffect(() => {
    if (isFirstSearch.current || (lastExecutedValue.current === "" && value !== "")) {
      setDebouncedValue(value);
      lastExecutedValue.current = value;
      isFirstSearch.current = false;
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
      lastExecutedValue.current = value;
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};