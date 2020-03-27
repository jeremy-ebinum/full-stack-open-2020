import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { ALL_NOTIFICATIONS } from "../graphql/queries";
import limitNotifications from "../utils/limitArrayOfObjectsByDate";
import Notification from "./Notification";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const getAllNotifications = useQuery(ALL_NOTIFICATIONS);

  useEffect(() => {
    if (getAllNotifications.data) {
      const notifications = getAllNotifications.data.allNotifications;
      setNotifications(notifications);
    }
  }, [getAllNotifications.data]);

  const notificationsToShow = limitNotifications(notifications, 3);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="d-flex flex-column"
      style={{
        position: "fixed",
        top: "60px",
        right: 0,
        zIndex: 1,
      }}
    >
      {notificationsToShow.map((n) => (
        <Notification
          key={n.id}
          id={n.id}
          message={n.message}
          timeout={n.timeout}
          level={n.level}
        />
      ))}
    </div>
  );
};

export default Notifications;
