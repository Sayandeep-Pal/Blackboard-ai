import React, { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import {jwtDecode} from "../node_modules/jwt-decode/build/cjs/index";
import axios from "axios";
import Whiteboard from "./Whiteboard";
import "./App.css";
import "./Login.css";

const LoginPage = () => {
  const [auth, setAuth] = useState(false);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse?.credential);
      const name = `${decoded.given_name} ${decoded.family_name}`;
      
      // Save user info in the backend
      await axios.post("https://blackboard-ai-be.vercel.app/createUser", {
        username: name,
        email: decoded.email,
      });

      console.log("User decoded:", decoded);
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

  return (
    <>
      {!auth ? (
        <div className="login-page">
          <div className="login-card">
            <h1 className="login-title">Welcome to Blackboard.ai</h1>
            <p className="login-subtitle">
              Sign in to access your personalized whiteboard experience.
            </p>

            <GoogleOAuthProvider clientId="732493616824-t61jg5fv6kte173v3bcloh04jci234op.apps.googleusercontent.com">
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
