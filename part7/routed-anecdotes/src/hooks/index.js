import { useState, useCallback } from "react";

export const useField = ({ type = "text" } = {}) => {
  const [value, setValue] = useState("");

  const onChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  const reset = useCallback(() => setValue(""), []);

  return [{ type, value, onChange }, reset];
};
