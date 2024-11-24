import { useState, useCallback } from "react";

const useToggleState = (initialState: boolean) => {
  const [state, setState] = useState(initialState);

  const toggleState = useCallback(() => {
    setState((prev) => !prev);
  }, []);

  return [state, toggleState] as const;
};

export default useToggleState;
