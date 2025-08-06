import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginDebug: React.FC = () => {
  const { 
    isAuthenticated, 
    isLoading, 
    error, 
    user, 
    loginWithRedirect, 
    logout,
    getAccessTokenSilently 
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

  const checkToken = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log('Access token:', token);
      
      // Decode the token
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
    } catch (err) {
      console.error('Token error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Login Debug</h1>
        
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
            <button
              onClick={checkToken}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Check Token
            </button>
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
      </div>
    </div>
  );
};

export default LoginDebug; 