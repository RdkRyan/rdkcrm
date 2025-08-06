import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { hasAdminRole, hasReadContactsRole, getUserRole } from '../utils/roleUtils';

const RoleTest: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Role Test</h1>
          <p>Please log in to test roles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Role Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Primary Role:</strong> {getUserRole(user) || 'None'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Role Checks</h2>
          <div className="space-y-2">
            <p><strong>Has Admin Role:</strong> {hasAdminRole(user) ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Has Read Contacts Role:</strong> {hasReadContactsRole(user) ? '✅ Yes' : '❌ No'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Object (for debugging)</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default RoleTest; 