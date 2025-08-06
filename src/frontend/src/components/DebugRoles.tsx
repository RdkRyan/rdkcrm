import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { inspectUserRoles, getRolesFromToken } from '../utils/tokenUtils';

const DebugRoles: React.FC = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<string>('');
  const [decodedToken, setDecodedToken] = useState<any>(null);

  const inspectRoles = () => {
    inspectUserRoles(user, token);
  };

  const getToken = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE
        }
      });
      setToken(accessToken);
      
      // Decode the token
      const decoded = JSON.parse(atob(accessToken.split('.')[1]));
      setDecodedToken(decoded);
      
      console.log('=== TOKEN INSPECTION ===');
      console.log('Access Token:', accessToken);
      console.log('Decoded Token:', decoded);
      
      // Check for roles in the token
      const roles = getRolesFromToken(accessToken);
      console.log('Roles found in token:', roles);
      
    } catch (error) {
      console.error('Error getting token:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Debug Roles</h2>
        <p>Please log in to inspect roles.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Debug Roles & Token Inspection</h2>
      
      <div className="mb-6">
        <button
          onClick={getToken}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-4"
        >
          Get Access Token
        </button>
        <button
          onClick={inspectRoles}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Inspect User & Token
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">User Object</h3>
          <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        {decodedToken && (
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Decoded Token</h3>
            <pre className="text-xs overflow-auto max-h-96">
              {JSON.stringify(decodedToken, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-6 bg-yellow-50 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Get Access Token" to retrieve and decode the token</li>
          <li>Click "Inspect User & Token" to log detailed information to console</li>
          <li>Check the browser console for detailed role information</li>
          <li>Look for roles in the user object and decoded token</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugRoles; 