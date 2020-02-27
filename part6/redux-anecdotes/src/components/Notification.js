import React from "react";
import { Alert } from "./Styles";

const Notification = ({ store }) => {
  const { notifications } = store.getState();

  return (
    <div>
      {notifications.map((notification) => (
        <Alert key={notification.id} className={notification.className}>
          {notification.message}
        </Alert>
      ))}
    </div>
  );
};

export default Notification;
