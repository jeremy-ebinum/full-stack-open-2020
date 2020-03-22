import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { ALL_NOTIFICATIONS } from "../queries";
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

  const notificationsToShow = limitNotifications(notifications);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "sticky",
        top: 0,
        right: 0,
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
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
    </div>
  );
};

export default Notifications;
