import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { createApiService, Customer, ReportData, EmployeeCallLog } from '../services/apiService';
import { hasAdminRole } from '../utils/roleUtils';

const Admin: React.FC = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently, user } = useAuth0();
  const [tokenMessage, setTokenMessage] = useState("Click to get a token.");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [employeeCallLogs, setEmployeeCallLogs] = useState<EmployeeCallLog[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingReportData, setLoadingReportData] = useState(false);
  const [loadingCallLogs, setLoadingCallLogs] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Create API service with the getAccessTokenSilently function
  const apiService = createApiService(() => 
    getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.REACT_APP_AUTH0_AUDIENCE
      }
    })
  );

  const getToken = async () => {
    try {
      setApiError(null);
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE
        }
      });
      setTokenMessage(`Successfully retrieved access token! Token: ${accessToken}`);

    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Error getting token:', error);
      setTokenMessage(`Error getting token: ${errorMessage}`);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoadingContacts(true);
      setApiError(null);
      const response = await apiService.getContacts();
      setCustomers(response.items);
      setTokenMessage(`Successfully fetched ${response.items.length} customers!`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setApiError(`Customers Error: ${errorMessage}`);
      console.error('Error fetching customers:', error);
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

  const fetchEmployeeCallLogs = async () => {
    try {
      setLoadingCallLogs(true);
      setApiError(null);
      const data = await apiService.getEmployeeCallLogs();
      setEmployeeCallLogs(data);
      setTokenMessage(`Successfully fetched ${data.length} employee call logs!`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setApiError(`Employee Call Logs Error: ${errorMessage}`);
      console.error('Error fetching employee call logs:', error);
    } finally {
      setLoadingCallLogs(false);
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
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">You must be logged in to access the admin panel.</p>
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  if (!hasAdminRole(user)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">You do not have admin privileges to access this panel.</p>
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">API Tester</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">
            Test your API endpoints with authentication and permission validation
          </p>
          


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
            </div>
          </div>

          {/* API Testing */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">API Endpoint Testing</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
                             <button
                 onClick={fetchCustomers}
                 disabled={loadingContacts}
                 className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {loadingContacts ? 'Loading...' : 'Fetch Customers'}
               </button>
              <button
                onClick={fetchReportData}
                disabled={loadingReportData}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingReportData ? 'Loading...' : 'Fetch Report Data'}
              </button>
              <button
                onClick={fetchEmployeeCallLogs}
                disabled={loadingCallLogs}
                className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl shadow-lg hover:bg-teal-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingCallLogs ? 'Loading...' : 'Fetch Call Logs'}
              </button>
            </div>
          </div>

          {/* Status Messages */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Status</h2>
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-xl text-left">
              <pre className="text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap">{tokenMessage}</pre>
            </div>
          </div>

          {/* Error Display */}
          {apiError && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-red-700 dark:text-red-400 mb-4">Error</h2>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl text-left">
                <pre className="text-red-800 dark:text-red-200 overflow-x-auto whitespace-pre-wrap">{apiError}</pre>
              </div>
            </div>
          )}

          {/* Results Display */}
          {(customers.length > 0 || reportData.length > 0 || employeeCallLogs.length > 0) && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Results</h2>
              
              {customers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Customers ({customers.length})</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-xl text-left max-h-60 overflow-y-auto">
                    <pre className="text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(customers, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {reportData.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Report Data ({reportData.length})</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-xl text-left max-h-60 overflow-y-auto">
                    <pre className="text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(reportData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {employeeCallLogs.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Employee Call Logs ({employeeCallLogs.length})</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-xl text-left max-h-60 overflow-y-auto">
                    <pre className="text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(employeeCallLogs, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin; 