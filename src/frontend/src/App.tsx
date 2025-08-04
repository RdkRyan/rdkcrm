import React, { useState } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { createApiService, Contact, ReportData } from './services/apiService';
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
      <AuthButtons />
    </Auth0Provider>
  );
};

const AuthButtons = () => {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [tokenMessage, setTokenMessage] = useState("Click to get a token.");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingReportData, setLoadingReportData] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Create API service with the getAccessTokenSilently function
  const apiService = createApiService(() => 
    getAccessTokenSilently({
      authorizationParams: {
        audience: audience
      }
    })
  );

  const getToken = async () => {
    try {
      setApiError(null);
      // It's crucial to request the audience again when getting the token silently.
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: audience
        }
      });
      setTokenMessage(`Successfully retrieved access token! Token: ${accessToken}`);
      console.log('Access Token:', accessToken);
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Error getting token:', error);
      setTokenMessage(`Error getting token: ${errorMessage}`);
    }
  };

  const fetchContacts = async () => {
    try {
      setLoadingContacts(true);
      setApiError(null);
      const data = await apiService.getContacts();
      setContacts(data);
      setTokenMessage(`Successfully fetched ${data.length} contacts!`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setApiError(`Contacts Error: ${errorMessage}`);
      console.error('Error fetching contacts:', error);
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchReportData = async () => {
    try {
      setLoadingReportData(true);
      setApiError(null);
      const data = await apiService.getReportData();
      setReportData(data);
      setTokenMessage(`Successfully fetched ${data.length} report items!`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setApiError(`Report Data Error: ${errorMessage}`);
      console.error('Error fetching report data:', error);
    } finally {
      setLoadingReportData(false);
    }
  };

  const validateToken = async () => {
    try {
      setApiError(null);
      const isValid = await apiService.validateToken();
      if (isValid) {
        setTokenMessage('Token is valid and has proper permissions!');
      } else {
        setTokenMessage('Token validation failed.');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setApiError(`Token Validation Error: ${errorMessage}`);
      console.error('Error validating token:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600 text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">RDK CRM API Tester</h1>

        {isAuthenticated ? (
          <>
            <p className="text-lg text-green-600 mb-2">You are logged in!</p>
            
            {/* Token Management */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Token Management</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
                <button
                  onClick={getToken}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-green-500"
                >
                  Get Access Token
                </button>
                <button
                  onClick={validateToken}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500"
                >
                  Validate Token
                </button>
                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-red-500"
                >
                  Log Out
                </button>
              </div>
            </div>

            {/* API Testing */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">API Endpoint Testing</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
                <button
                  onClick={fetchContacts}
                  disabled={loadingContacts}
                  className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingContacts ? 'Loading...' : 'Fetch Contacts'}
                </button>
                <button
                  onClick={fetchReportData}
                  disabled={loadingReportData}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingReportData ? 'Loading...' : 'Fetch Report Data'}
                </button>
              </div>
            </div>

            {/* Status Messages */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Status</h2>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-left">
                <pre className="text-gray-800 overflow-x-auto whitespace-pre-wrap">{tokenMessage}</pre>
              </div>
            </div>

            {/* Error Display */}
            {apiError && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-red-700 mb-4">Error</h2>
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-left">
                  <pre className="text-red-800 overflow-x-auto whitespace-pre-wrap">{apiError}</pre>
                </div>
              </div>
            )}

            {/* Results Display */}
            {(contacts.length > 0 || reportData.length > 0) && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Results</h2>
                
                {contacts.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Contacts ({contacts.length})</h3>
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-left max-h-60 overflow-y-auto">
                      <pre className="text-gray-800 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(contacts, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {reportData.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Report Data ({reportData.length})</h3>
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-left max-h-60 overflow-y-auto">
                      <pre className="text-gray-800 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(reportData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-lg text-gray-600 mb-6">You are not logged in. Please log in to continue.</p>
            <button
              onClick={() => loginWithRedirect()}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500"
            >
              Log In
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;