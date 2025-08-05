import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Layout from './components/Layout';
import Home from './components/Home';
import Contacts from './components/Contacts';
import CallLogs from './components/CallLogs';
import Admin from './components/Admin';
import './App.css';

// -----------------------------------------------------------
// Step 1: Ensure these environment variables are correct.
//
// The 'clientId' should be from your Auth0 'Default App' client.
// The 'audience' should be from your 'rdk-crm' API.
// -----------------------------------------------------------
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

const App = () => {
  if (!domain || !clientId || !audience) {
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
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        // The following scope is essential for the authorization code flow.
        scope: "openid profile email" 
      }}
    >
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/calllogs" element={<CallLogs />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
    </Auth0Provider>
  );
};

export default App;