import React from "react";
import PropTypes from "prop-types";
import { getTestIDs } from "../helpers/testHelper";

export const testIDs = getTestIDs();

const alertTypes = {
  error: "c-alert c-alert--error",
  success: "c-alert c-alert--success",
  info: "c-alert c-alert--info",
  default: "c-alert",
};

const Notification = ({ id, type, message }) => {
  return (
    <div
      className={`${alertTypes[type]}`}
      data-testid={testIDs[`Notification_${id}`]}
    >
      <span className="c-alert__txt">{message}</span>
    </div>
  );
};

Notification.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default Notification;
