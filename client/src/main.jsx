import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="732493616824-t61jg5fv6kte173v3bcloh04jci234op.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
          <App />
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </GoogleOAuthProvider>
    {/* <App /> */}
  </StrictMode>,
)
