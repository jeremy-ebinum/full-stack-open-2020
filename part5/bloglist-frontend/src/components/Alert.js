import React, { useEffect } from "react";

//  run the timeoutFunc after a given period with useEffect hook
const Alert = ({ timeoutFunc, id, type, message, contextClass }) => {
  const alertTypes = {
    error: "c-alert--error",
    success: "c-alert--success",
    info: "c-alert--info"
  };

  if (!alertTypes[type]) throw new Error("Invalid Alert Type");

  useEffect(() => {
    const removeAlert = () => timeoutFunc(id);
    setTimeout(removeAlert, 3000);
  }, [id, timeoutFunc]);

  return (
    <div className={`c-alert ${alertTypes[type]} ${contextClass}`}>
      <span className="c-alert__txt">{message}</span>
    </div>
  );
};

export default Alert;
