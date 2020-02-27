import React from "react";
import { NotificationContainer, Alert } from "./Styles";

const Notification = ({ store }) => {
  const { notifications } = store.getState();

  return (
    <NotificationContainer>
      {notifications.map((notification) => (
        <Alert key={notification.id} className={notification.className}>
          {notification.message}
        </Alert>
      ))}
    </NotificationContainer>
  );
};

export default Notification;
