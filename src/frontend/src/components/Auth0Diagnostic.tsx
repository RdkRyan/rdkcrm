import React from 'react';

const Auth0Diagnostic: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const errorDescription = urlParams.get('error_description');
  const state = urlParams.get('state');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-red-600">Auth0 Error Diagnostic</h1>
        
        <div className="bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Error Details</h2>
          <div className="space-y-2">
            <p><strong>Error:</strong> {error}</p>
            <p><strong>Description:</strong> {errorDescription}</p>
            <p><strong>State:</strong> {state}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Likely Causes</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">1. Role-Permission Mismatch</h3>
              <p className="text-gray-600">The role you assigned doesn't have the required permissions, or the permissions don't exist.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">2. API Configuration Issue</h3>
              <p className="text-gray-600">The API permissions don't match what the role is trying to access.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">3. Token Scope Problem</h3>
              <p className="text-gray-600">The requested scopes don't match the available permissions.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Immediate Fixes to Try</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Option 1: Remove Role Temporarily</h3>
              <p className="text-gray-600 mb-2">Go to Auth0 → User Management → Users → Your User → Roles tab → Remove the admin role</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Try Login Without Role
              </button>
            </div>
            
            <div>
              <h3 className="font-semibold">Option 2: Check Role Permissions</h3>
              <p className="text-gray-600 mb-2">Go to Auth0 → User Management → Roles → admin → Permissions tab → Make sure permissions exist</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Option 3: Verify API Permissions</h3>
              <p className="text-gray-600 mb-2">Go to Auth0 → APIs → rdk-crm → Permissions tab → Ensure permissions match role permissions</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Recommended Steps</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Remove the admin role from your user temporarily</li>
            <li>Test login without roles (should work)</li>
            <li>Go to APIs → rdk-crm → Permissions tab</li>
            <li>Add these permissions: <code>read:contacts</code>, <code>write:contacts</code>, <code>admin:access</code></li>
            <li>Go to User Management → Roles → admin → Permissions tab</li>
            <li>Add the same permissions to the admin role</li>
            <li>Reassign the admin role to your user</li>
            <li>Test login again</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Auth0Diagnostic; 