import React from "react";
import { connect } from "react-redux";
import { NotificationContainer, Alert } from "./Styles";

const Notification = (props) => {
  return (
    <NotificationContainer>
      {props.notificationsToShow.map((notification) => (
        <Alert key={notification.id} className={notification.level}>
          {notification.message}
        </Alert>
      ))}
    </NotificationContainer>
  );
};

const notificationsToShow = (notifications) => {
  if (notifications.length <= 3) {
    return notifications;
  } else {
    const notificationsByDateDesc = [...notifications].sort(
      (a, b) => b.date - a.date
    );

    const notificationsToShow = notificationsByDateDesc.slice(0, 3).reverse();

    return notificationsToShow;
  }
};

const mapStateToProps = (state) => {
  return { notificationsToShow: notificationsToShow(state.notifications) };
};
export default connect(mapStateToProps)(Notification);
