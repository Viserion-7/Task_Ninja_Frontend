import React, { useState } from "react";
import "./LoginSignup.css";

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div >
      {/* Blurred Background Image */}
      <div style={{backgroundImage: `url("/images/bg.png")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        
    }}>

      {/* Main Login/Signup Container */}
      <div className="login-signup-container">
        {/* Left Section for Image */}

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
              <form className="login">
                <div className="field">
                  <input type="text" placeholder="Email Address" required />
                </div>
                <div className="field">
                  <input type="password" placeholder="Password" required />
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
              <form className="signup">
                <div className="field">
                  <input type="text" placeholder="Email Address" required />
                </div>
                <div className="field">
                  <input type="password" placeholder="Password" required />
                </div>
                <div className="field">
                  <input type="password" placeholder="Confirm Password" required />
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