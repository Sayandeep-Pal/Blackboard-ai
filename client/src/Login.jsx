import React, { useEffect, useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Whiteboard from "./Whiteboard";
import "./App.css";
import "./Login.css";

const LoginPage = () => {
  const [auth, setAuth] = useState(false);
  const URL = import.meta.env.VITE_BE_URL;
  const id = import.meta.env.VITE_clientId;


  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse?.credential);
      const name = `${decoded.given_name} ${decoded.family_name}`;
      //   console.log("User decoded:", decoded);

      // Save user info in the backend
      await axios.post(`${URL}/createUser`, {
        username: name,
        email: decoded.email,
      });

      setAuth(true);
    } catch (error) {
      console.error("Error during login or user creation:", error);
      alert("An error occurred while logging in. Please try again.");
    }
  };

  const handleLoginError = () => {
    console.error("Google Login failed.");
    alert("Login failed. Please try again.");
  };

  const randomStyle = () => {
    const random = (min, max) => Math.random() * (max - min) + min;
  
    return {
      position: `absolute`,
      left: `${random(-10,100)}vw`, // Random horizontal position
      animationName: `fall`,
      top:`0`,
      // animationTimingFunction: `linear`,
      animationIterationCount: `infinite`,
      fontSize: `${random(10, 20)}px`, // Random size
      animationDuration: `${random(10, 15)}s`, // Random falling duration
      animationDelay: `${random(0, 5)}s`, // Random delay
      transform: `rotate(${random(0, 90)}deg)`, // Random rotation
    };
  };

  // useEffect(() => {
  //   randomStyle();
  // }, []);

  const fallingItems = [
    "y = mx + c",
    "∫xdx",
    "(a+b)²",
    "E = mc²",
    "sin(x) + cos(x)",
    "📚",
    "✏️",
    "🍎",
    "🚀",
    "📐",
    "a² + b² = c²",
    "🧮",
    "1 + 1 = 2",
    "πr²",
    "Δy/Δx",
    "∑x",
    "log(x)",
    "∞",
    "√x",
    "θ",
    "cos(θ)",
    "tan(θ)",
    "∂f/∂x",
    "v = u + at",
    "F = ma",
    "🌟",
    "🌍",
    "🌌",
    "☀️",
    "🎨",
    "📓",
    "✂️",
    "🎲",
    "🖋️",
    "x³",
    "∫e^x dx",
    "Ω",
    "⊗",
    "∘",
    "⇔",
    "∀x ∈ ℝ",
    "∃y",
    "ℕ",
    "φ",
    "∆",
    "v(t)",
    "∂²/∂x²",
    "lim(x→∞)",
    "∫∫dxdy",
  ];

  return (
    <>
      {!auth ? (
        <>
        {/* Falling Items */}
        <div className="falling-items">
            {fallingItems.map((item, index) => (
              <div
                key={index}
                className="falling"
                style={randomStyle()}
              >
                {item}
              </div>
            ))}
          </div>

        {/* Login Page */}
        <div className="login-page">
          <div className="login-card">
            <h1 className="login-title">Welcome to Blackboard.ai</h1>
            <p className="login-subtitle">
              Sign in to access your personalized whiteboard experience.
            </p>

            <GoogleOAuthProvider clientId={id}>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
              />
            </GoogleOAuthProvider>

            <div className="login-footer">
              <p>
                By signing in, you agree to our{" "}
                <a href="/terms" className="link">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="link">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </div>
        </div>

        <style jsx global>{`
        @keyframes fall {
          0% { 
            transform: translateY(0) rotate(-90deg); 
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) rotate(90deg); 
            opacity: 0;
          }
        }
      `}</style>
        </>
      ) : (
        <div className="app">
          <h1 className="icon">Blackboard</h1>
          <Whiteboard />
        </div>
      )}
    </>
  );
};

export default LoginPage;
