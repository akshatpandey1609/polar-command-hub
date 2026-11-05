import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("polarUser", JSON.stringify(user));
        onLogin(user);
      } else {
        setError("Invalid username or password.");
      }
    } catch {
      setError("An error occurred during login. Please try again.");
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

        <div className="login-footer">
          AUTHORIZED PERSONNEL ONLY • SIH26062
        </div>

      </div>
    </div>
  );
}

export default Login;