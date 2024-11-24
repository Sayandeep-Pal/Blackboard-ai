import React from "react";
import Whiteboard from "./Whiteboard";
import './App.css'
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import React, { useState, useRef, useEffect } from "react";
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios';


const App = () => {

  const [user, setUser] = useState(null); // User details
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = (response) => {
    console.log("Login Success:", response);
    setUser(response.profileObj);
    setIsAuthenticated(true);

    // Optionally send the token to your backend for verification
    axios.post('https://blackboard-ai-be.vercel.app/auth/google', { token: response.tokenId })
      .then(res => console.log("Backend verification success:", res.data))
      .catch(err => console.error("Error verifying token:", err));
  };

  const handleLoginFailure = (response) => {
    console.error("Login Failed:", response);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <>
      <div className="auth-container">
        {!isAuthenticated ? (
          <GoogleLogin
            clientId="732493616824-t61jg5fv6kte173v3bcloh04jci234op.apps.googleusercontent.com" // Replace with your client ID
            buttonText="Continue with Google"
            onSuccess={handleLoginSuccess}
            onFailure={handleLoginFailure}
            cookiePolicy={'single_host_origin'}
          />
        ) : (
          <div>
            <GoogleLogout
              clientId="732493616824-t61jg5fv6kte173v3bcloh04jci234op.apps.googleusercontent.com"
              buttonText="Logout"
              onLogoutSuccess={handleLogout}
            />
            <div className="app">
              <h1>Blackboard</h1>
              <Whiteboard />
            </div>
          </div>
        )}
      </div>

      {/* <div className="app">
        <h1>Blackboard</h1>
        <Whiteboard />
      </div> */}
    </>
  );
};

export default App;
