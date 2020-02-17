import React, { useState } from "react";
import Login from "./components/Login";
import ModalSpinner from "./components/ModalSpinner";

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModalSpinner, setShowModalSpinner] = useState(false);

  const handleLogin = event => {
    event.preventDefault();
    console.log(`Logging in with ${username} and ${password}`);

    setShowModalSpinner(true);
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

  return (
    <div className="o-container js-container">
      {!user && <Login {...loginProps} />}

      {showModalSpinner && <ModalSpinner />}
    </div>
  );
}

export default App;
