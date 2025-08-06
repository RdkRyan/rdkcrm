import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Layout from '../src/components/Layout';
import Home from '../src/components/Home';
import Contacts from '../src/components/Contacts';
import CallLogs from '../src/components/CallLogs';
import Admin from '../src/components/Admin';
import RoleTest from '../src/components/RoleTest';
import Auth0Diagnostic from '../src/components/Auth0Diagnostic';
import SimpleAuth from '../src/components/SimpleAuth';
import UserDebug from '../src/components/UserDebug';
import ErrorBoundary from '../src/components/ErrorBoundary';
import '../src/App.css';

// Environment variables
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

const App = () => {
  if (!domain || !clientId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md">
          <p className="font-bold">Configuration Error</p>
          <p className="text-sm">Please ensure your .env file is correctly set up with the Auth0 variables.</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          scope: "openid profile email"
        }}
        onRedirectCallback={(appState) => {
          console.log('Auth0 redirect callback:', appState);
        }}
      >
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/calllogs" element={<CallLogs />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/role-test" element={<RoleTest />} />
              <Route path="/auth0-diagnostic" element={<Auth0Diagnostic />} />
              <Route path="/simple-auth" element={<SimpleAuth />} />
              <Route path="/user-debug" element={<UserDebug />} />
            </Routes>
          </Layout>
        </Router>
      </Auth0Provider>
    </ErrorBoundary>
  );
};

export default App; 