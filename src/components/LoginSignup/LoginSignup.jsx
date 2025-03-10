import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./LoginSignup.css";

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    // Check if user exists and credentials match
    if (storedUser && storedUser.email === email && storedUser.password === password) {
      localStorage.setItem("auth", "true"); // Mark user as logged in
      navigate("/dashboard"); // Redirect to dashboard
    } else {
      alert("Invalid Credentials");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();  // Prevents page refresh
  
    if (!email || !password) {
      alert("Please fill in all fields!");
      return;
    }
  
    console.log("Signup function triggered");  // Debugging
  
    // Store user data in localStorage
    const newUser = { email, password };
    localStorage.setItem("user", JSON.stringify(newUser));
  
    alert("Signup Successful! You can now login.");
    setIsSignup(false); // Switch to login page
  };

  return (
    <div>
      {/* Blurred Background Image */}
      <div
        style={{
          backgroundImage: `url("/images/bg.png")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {/* Main Login/Signup Container */}
        <div className="login-signup-container">
          {/* Right Section for Login/Signup */}
          <div className="form-section">
            <div className="title-text">
              <h2>{isSignup ? "Signup Form" : "Login Form"}</h2>
            </div>

            <div className="slide-controls">
              <button
                className={`slide ${!isSignup ? "active" : ""}`}
                onClick={() => setIsSignup(false)}
              >
                Login
              </button>
              <button
                className={`slide ${isSignup ? "active" : ""}`}
                onClick={() => setIsSignup(true)}
              >
                Signup
              </button>
            </div>

            <div className="form-inner">
              {!isSignup ? (
                // Login Form
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
                  <div className="pass-link">
                    <a href="#">Forgot password?</a>
                  </div>
                  <div className="field btn">
                    <input type="submit" value="Login" />
                  </div>
                  <div className="signup-link">
                    Not a member?{" "}
                    <a href="#" onClick={() => setIsSignup(true)}>
                      Signup now
                    </a>
                  </div>
                </form>
              ) : (
                // Signup Form (Can be expanded later)
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
  <div className="field btn">
    <input type="submit" value="Signup" />
  </div>
</form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;