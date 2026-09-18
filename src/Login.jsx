import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const users = [
      {
        username: "admin@polarcommand.com",
        password: "Admin@123",
        role: "Administrator",
      },
      {
        username: "manager@polarcommand.com",
        password: "Manager@123",
        role: "Expedition Manager",
      },
      {
        username: "staff@polarcommand.com",
        password: "Staff@123",
        role: "Operations Staff",
      },
    ];

    const user = users.find(
      (item) =>
        item.username.toLowerCase() === username.toLowerCase() &&
        item.password === password
    );

    if (user) {
      localStorage.setItem("polarUser", JSON.stringify(user));
      onLogin(user);
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <div className="login-icon">❄</div>
          <h1>POLAR</h1>
          <span>COMMAND CENTER</span>
        </div>

        <div className="login-heading">
          <p>SECURE ACCESS</p>
          <h2>Welcome Back</h2>
          <span>Sign in to access the expedition command center.</span>
        </div>

        <form onSubmit={handleSubmit}>

          <label>Email / Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-button">
            SIGN IN →
          </button>
        </form>

        <div className="demo-login">
          <strong>Demo Access</strong>
          <p>Administrator: admin@polarcommand.com</p>
          <p>Password: Admin@123</p>
        </div>

        <div className="login-footer">
          AUTHORIZED PERSONNEL ONLY • SIH26062
        </div>

      </div>
    </div>
  );
}

export default Login;