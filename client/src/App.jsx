import React, { useState } from "react";
import Whiteboard from "./Whiteboard";
import './App.css'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'


const App = () => {

  const [auth, setAuth] = useState(false);

  return (
    <>
      {auth === false && (<GoogleOAuthProvider clientId="732493616824-t61jg5fv6kte173v3bcloh04jci234op.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
          setAuth(true);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </GoogleOAuthProvider>)}
    
    
      {auth === true &&
        (<div className="app">
          <h1>Blackboard</h1>
          <Whiteboard />
        </div>) 
       }
      
    </>
    
  );
};

export default App;
