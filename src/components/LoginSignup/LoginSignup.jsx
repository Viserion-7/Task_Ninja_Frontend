import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./LoginSignup.css";

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login: authLogin } = useAuth();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = await login(username, password);
      authLogin(userData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !email || !password) {
      setError("Please fill in all fields!");
      setLoading(false);
      return;
    }

    try {
      // Register the user
      await register(username, email, password);
      
      // Log them in automatically
      const userData = await login(username, password);
      authLogin(userData);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.username) {
        setError("Username already exists!");
      } else if (err.response?.data?.email) {
        setError("Email already exists!");
      } else {
        setError("An error occurred during signup. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url("/images/bg.png")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="login-signup-container">
        <div className="form-section">
          <div className="title-text">
            <h2>{isSignup ? "Signup Form" : "Login Form"}</h2>
          </div>

          <div className="slide-controls">
            <button className={`slide ${!isSignup ? "active" : ""}`} onClick={() => setIsSignup(false)}>Login</button>
            <button className={`slide ${isSignup ? "active" : ""}`} onClick={() => setIsSignup(true)}>Signup</button>
          </div>

          <div className="form-inner">
            {error && <div className="error-message">{error}</div>}
            {!isSignup ? (
              <form onSubmit={handleLogin} className="login">
                <div className="field">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="pass-link"><a href="#">Forgot password?</a></div>
                <div className="field btn">
                  <input 
                    type="submit" 
                    value={loading ? "Loading..." : "Login"} 
                    disabled={loading}
                  />
                </div>
                <div className="signup-link">
                  Not a member? <a href="#" onClick={() => setIsSignup(true)}>Signup now</a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="signup">
                <div className="field">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                  />
                </div>
                <div className="field btn">
                  <input 
                    type="submit" 
                    value={loading ? "Loading..." : "Signup"} 
                    disabled={loading}
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
