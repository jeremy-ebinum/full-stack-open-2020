import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Notification from "./Notification";

const NotificationList = ({ notificationsToShow, contextClass }) => {
  const className = contextClass
    ? `c-alerts-container ${contextClass}`
    : "c-alerts-container";

  return (
    <div className={className}>
      {notificationsToShow.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          type={notification.level}
          message={notification.message}
        />
      ))}
    </div>
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

const mapStateToProps = (state, ownProps) => {
  return {
    notificationsToShow: notificationsToShow(state.notifications),
    contextClass: ownProps.contextClass,
  };
};

NotificationList.propTypes = {
  notificationsToShow: PropTypes.arrayOf(PropTypes.object).isRequired,
  contextClass: PropTypes.string,
};

NotificationList.defaultProps = {
  contextClass: null,
};

export default connect(mapStateToProps)(NotificationList);
