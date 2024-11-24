import React from "react";
import Whiteboard from "./Whiteboard";
import './App.css'
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const App = () => {
  return (
    <>
      <GoogleOAuthProvider clientId="<your_client_id>">
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
            <div className="app">
              <h1>Blackboard</h1>
              <Whiteboard />
            </div>
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </GoogleOAuthProvider>


    </>
  );
};

export default App;
