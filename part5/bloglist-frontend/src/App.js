import React, { useState } from "react";
import uniqueRandom from "unique-random";
import AlertList from "./components/AlertList";
import Login from "./components/Login";
import ModalSpinner from "./components/ModalSpinner";

const random = uniqueRandom(1, 10000);

function App() {
  const [alerts, setAlerts] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModalSpinner, setShowModalSpinner] = useState(false);

  const handleLogin = event => {
    event.preventDefault();
    console.log(`Logging in with ${username} and ${password}`);

    setShowModalSpinner(true);

    queueAlerts([
      {
        type: "info",
        message: `Logged in as ${username}`
      }
    ]);

    setUsername("");
    setPassword("");
  };

  const loginProps = {
    showPassword,
    passwordType: `${showPassword ? "text" : "password"}`,
    usernameValue: username,
    passwordValue: password,
    handleUsernameChange: ({ target }) => setUsername(target.value),
    handlePasswordChange: ({ target }) => setPassword(target.value),
    handlePasswordTogglerClick: () => setShowPassword(!showPassword),
    handleSubmit: event => handleLogin(event)
  };

  const queueAlerts = newAlerts => {
    const timeoutFunc = id => setAlerts(alerts.filter(a => a.id !== id));

    const alertsWithTimeout = newAlerts.map(a => {
      return {
        ...a,
        id: `${a.type}-${random()}`,
        timeoutFunc: timeoutFunc
      };
    });

    setAlerts(alerts.concat(...alertsWithTimeout));
  };

  return (
    <div className="o-container js-container">
      <AlertList alerts={alerts} />

      {!user && <Login {...loginProps} />}

      {showModalSpinner && <ModalSpinner />}
    </div>
  );
}

export default App;
