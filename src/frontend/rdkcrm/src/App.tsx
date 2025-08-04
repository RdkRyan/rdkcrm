import React from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

function App() {
  // Debug: Log environment variables
  console.log('Environment variables:', {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE
  });

  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN!}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <LoginScreen />
      </div>
    </Auth0Provider>
  );
}

function LoginScreen() {
  const { loginWithRedirect, isAuthenticated, logout, user, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-600 mb-6">
            {user?.name || user?.email}
          </p>
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="w-full bg-red-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-red-500"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">RDK CRM</h1>
        <p className="text-gray-600 mb-8">Sign in to access your dashboard</p>
        
        <button
          onClick={() => loginWithRedirect()}
          className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 shadow-lg"
        >
          Sign In
        </button>
        
        <p className="text-sm text-gray-500 mt-6">
          Secure authentication powered by Auth0
        </p>
      </div>
    </div>
  );
}

export default App; 