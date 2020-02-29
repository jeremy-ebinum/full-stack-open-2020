import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NotificationContainer, Alert } from "./StyledComponents";

const Notification = ({ notificationsToShow }) => {
  return (
    <NotificationContainer>
      {notificationsToShow.map((notification) => (
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

    const lastThreeNotifications = notificationsByDateDesc
      .slice(0, 3)
      .reverse();

    return lastThreeNotifications;
  }
};

const mapStateToProps = (state) => {
  return { notificationsToShow: notificationsToShow(state.notifications) };
};

Notification.propTypes = {
  notificationsToShow: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps)(Notification);
