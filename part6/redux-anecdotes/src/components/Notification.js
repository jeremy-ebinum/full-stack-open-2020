import React from "react";
import { connect } from "react-redux";
import { NotificationContainer, Alert } from "./Styles";

const Notification = (props) => {
  return (
    <NotificationContainer>
      {props.notifications.map((notification) => (
        <Alert key={notification.id} className={notification.level}>
          {notification.message}
        </Alert>
      ))}
    </NotificationContainer>
  );
};

const mapStateToProps = (state) => {
  return { notifications: state.notifications };
};
export default connect(mapStateToProps)(Notification);
