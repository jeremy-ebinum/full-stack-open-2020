import React, { useState } from "react";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = event => {
    console.log(`Logging in with ${username} and ${password}`);
    event.preventDefault();
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
    <div className="o-container">{!user && <Login {...loginProps} />}</div>
  );
}

export default App;
