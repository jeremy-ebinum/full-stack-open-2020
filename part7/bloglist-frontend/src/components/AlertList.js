import React from "react";
import PropTypes from "prop-types";
import Alert from "./Alert";

const AlertList = ({ alerts, contextClass }) => {
  const alertsToDisplay = alerts.map((alert) => {
    return (
      <Alert
        key={alert.id}
        timeoutFunc={alert.timeoutFunc}
        id={alert.id}
        type={alert.type}
        contextClass={contextClass}
        message={alert.message}
      />
    );
  });

  return alertsToDisplay;
};

AlertList.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.object).isRequired,
  contextClass: PropTypes.string.isRequired,
};

const shouldNotUpdate = (prevProps, nextProps) => {
  const sameAlerts = prevProps.alerts.length === nextProps.alerts.length;
  const sameContextClass = prevProps.contextClass === nextProps.contextClass;

  if (sameAlerts && sameContextClass) {
    return true;
  }

  return false;
};

export default React.memo(AlertList, shouldNotUpdate);
