import React from "react";

export function useDebounce<T>(value: T, delayMs: number): T {
  const [v, setV] = React.useState<T>(value);

  React.useEffect(() => {
    const id = window.setTimeout(() => setV(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return v;
}
