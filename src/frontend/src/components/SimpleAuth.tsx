import React, { useState } from 'react';

const SimpleAuth: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleLogin = () => {
    const mockUser = {
      email: 'test@example.com',
      name: 'Test User',
      app_metadata: {
        roles: ['admin']
      }
    };
    setUser(mockUser);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simple Auth Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Auth State</h2>
          <div className="space-y-2">
            <p><strong>Logged In:</strong> {isLoggedIn ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? 'Present' : 'None'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            {!isLoggedIn ? (
              <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Login (Mock)
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

        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-6 rounded-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <p>If this works, the issue is definitely with your Auth0 configuration. You may need to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Create a new Auth0 application</li>
            <li>Check your Auth0 tenant settings</li>
            <li>Verify your domain and client ID are correct</li>
            <li>Clear all Auth0 cache and cookies</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimpleAuth; 