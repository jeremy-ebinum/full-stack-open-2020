import React from "react";
import Alert from "./Alert";

const AlertList = props => {
  const alerts = props.alerts.map(alert => {
    return (
      <Alert
        timeoutFunc={alert.timeoutFunc}
        key={alert.id}
        id={alert.id}
        type={alert.type}
        contextClass={props.contextClass}
        message={alert.message}
      ></Alert>
    );
  });

  return alerts;
};

export default AlertList;
