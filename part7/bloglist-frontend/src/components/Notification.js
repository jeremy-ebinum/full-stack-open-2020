import React from "react";
import PropTypes from "prop-types";

const alertTypes = {
  error: "c-alert c-alert--error",
  success: "c-alert c-alert--success",
  info: "c-alert c-alert--info",
  default: "c-alert",
};

const Notification = ({ type, message }) => {
  return (
    <div className={`${alertTypes[type]}`}>
      <span className="c-alert__txt">{message}</span>
    </div>
  );
};

Notification.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default Notification;
