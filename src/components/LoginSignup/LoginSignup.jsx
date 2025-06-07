import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
      localStorage.setItem("auth", JSON.stringify(validUser)); //  Store logged-in user
      navigate("/dashboard"); //  Redirect
    } else {
      alert("Invalid credentials. Try again or sign up.");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find(user => user.email === email);

    if (userExists) {
      alert("User already exists! Please log in.");
      return;
    }

    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! Please log in.");
    setIsSignup(false);
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
            {!isSignup ? (
              <form onSubmit={handleLogin} className="login">
                <div className="field">
                  <input
                    type="text"
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
                <div className="pass-link"><a href="#">Forgot password?</a></div>
                <div className="field btn"><input type="submit" value="Login" /></div>
                <div className="signup-link">
                  Not a member? <a href="#" onClick={() => setIsSignup(true)}>Signup now</a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="signup">
                <div className="field">
                  <input
                    type="text"
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
                <div className="field btn"><input type="submit" value="Signup" /></div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;