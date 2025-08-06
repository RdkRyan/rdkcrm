import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const UserDebug: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div className="p-4">Please log in to see user data</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Object Debug</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">User Object Structure:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="bg-blue-100 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Role Locations:</h2>
        <ul className="space-y-2">
          <li><strong>user.roles:</strong> {JSON.stringify(user?.roles)}</li>
          <li><strong>user.app_metadata?.roles:</strong> {JSON.stringify(user?.app_metadata?.roles)}</li>
          <li><strong>user['https://your-namespace/roles']:</strong> {JSON.stringify(user?.['https://your-namespace/roles'])}</li>
          <li><strong>user['https://your-domain/roles']:</strong> {JSON.stringify(user?.['https://your-domain/roles'])}</li>
        </ul>
      </div>

      <div className="bg-green-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">All User Properties:</h2>
        <ul className="text-sm space-y-1">
          {user && Object.keys(user).map(key => (
            <li key={key}><strong>{key}:</strong> {JSON.stringify(user[key])}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDebug; 