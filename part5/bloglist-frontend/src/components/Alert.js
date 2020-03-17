import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { getTestIDs } from "../helpers/testHelper";

export const testIDs = getTestIDs();

//  run the timeoutFunc after a given period with useEffect hook
const Alert = ({ timeoutFunc, id, type, contextClass, message }) => {
  const alertTypes = {
    error: "c-alert--error",
    success: "c-alert--success",
    info: "c-alert--info",
  };

  if (!alertTypes[type]) throw new Error("Invalid Alert Type");

  useEffect(() => {
    const removeAlert = () => timeoutFunc(id);
    setTimeout(removeAlert, 3000);
  }, [id, timeoutFunc]);

  return (
    <div
      className={`c-alert ${alertTypes[type]} ${contextClass}`}
      data-testid={testIDs[`Alert_${id}`]}
    >
      <span className="c-alert__txt">{message}</span>
    </div>
  );
};

Alert.propTypes = {
  timeoutFunc: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  contextClass: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default React.memo(Alert);
