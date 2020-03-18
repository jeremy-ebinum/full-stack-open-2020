import { useState, useCallback } from "react";

export const useField = ({
  id = null,
  className = "c-row__input",
  type = "text",
  name = null,
  placeholder = null,
}) => {
  const [value, setValue] = useState("");

  const onChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  const reset = useCallback(() => setValue(""), []);

  return [{ id, className, type, name, placeholder, value, onChange }, reset];
};
