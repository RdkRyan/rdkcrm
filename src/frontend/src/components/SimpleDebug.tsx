import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const SimpleDebug: React.FC = () => {
  const { 
    isAuthenticated, 
    isLoading, 
    error, 
    user, 
    loginWithRedirect, 
    logout 
  } = useAuth0();

  const handleLogin = () => {
    console.log('Attempting login...');
    try {
      loginWithRedirect();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simple Login Debug</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Auth State</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error ? error.message : 'None'}</p>
            <p><strong>User:</strong> {user ? 'Present' : 'None'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            {!isAuthenticated ? (
              <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {user && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">User Object</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Error Details</h2>
            <pre className="text-sm">{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}

        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded mt-6">
          <h2 className="text-xl font-semibold mb-2">Troubleshooting Tips</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Check your Auth0 application settings</li>
            <li>Verify the callback URLs are correct</li>
            <li>Make sure the domain and client ID are correct</li>
            <li>Check if the new Admin role is properly configured</li>
            <li>Try clearing browser cache and cookies</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimpleDebug; 