import React, { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import Whiteboard from "./Whiteboard";
import './App.css'
import "./Login.css";

const LoginPage = () => {

    const [auth, setAuth] = useState(false);

    return (
        <>
            {auth === false && (<div className="login-page">
                <div className="login-card">
                    <h1 className="login-title">Welcome to Blackboard.ai</h1>
                    <p className="login-subtitle">
                        Sign in to access your personalized whiteboard experience.
                    </p>

                    <GoogleOAuthProvider clientId="732493616824-t61jg5fv6kte173v3bcloh04jci234op.apps.googleusercontent.com">
                        <GoogleLogin 
                            onSuccess={credentialResponse => {
                                console.log(credentialResponse);
                                setAuth(true);
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
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
            </div>)}

            {auth === true &&
                (<div className="app">
                    <h1>Blackboard</h1>
                    <Whiteboard />
                </div>)
            }
        </>
    );
};

export default LoginPage;
