import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams, useNavigate } from 'react-router-dom';
import { createApiService, Customer, Note } from '../services/apiService';

const CustomerDetails: React.FC = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);

  // Create API service with the getAccessTokenSilently function
  const apiService = createApiService(() =>
    getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.REACT_APP_AUTH0_AUDIENCE
      }
    })
  );

  const fetchCustomerDetails = async () => {
    if (!customerId) return;
    
    try {
      setLoading(true);
      setError(null);
      // Use the dedicated endpoint for customer details
      const customer = await apiService.getCustomerById(customerId);
      setCustomer(customer);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to fetch customer details: ${errorMessage}`);
      console.error('Error fetching customer details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && customerId) {
      fetchCustomerDetails();
    }
  }, [isAuthenticated, customerId]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackToCustomers = () => {
    // Don't remove the scroll position here - let the Customers component handle it
    navigate('/customers');
  };

  const handleShowNotes = async () => {
    if (!customer?.id) return;
    
    try {
      setNotesLoading(true);
      setNotesError(null);
      const notesData = await apiService.getNotesByCustomerId(customer.id);
      setNotes(notesData);
      setShowNotesDialog(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setNotesError(`Failed to fetch notes: ${errorMessage}`);
      console.error('Error fetching notes:', error);
    } finally {
      setNotesLoading(false);
    }
  };

  const handleCloseNotesDialog = () => {
    setShowNotesDialog(false);
    setNotes([]);
    setNotesError(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format phone number for display
  const formatPhoneNumber = (phone: string | null) => {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 10) {
      // (XXX) XXX-XXXX
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      // 1 (XXX) XXX-XXXX
      return `1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 7) {
      // XXX-XXXX
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    }
    
    // Return original if no standard format matches
    return phone;
  };

  const getPhoneDisplay = (phone: string | null, doNotCall: number) => {
    if (!phone) return null;
    return (
      <div className="flex items-center">
        <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <a
          href={`tel:${phone}`}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
        >
          {formatPhoneNumber(phone)}
        </a>
        {doNotCall === 1 ? (
          <span className="ml-2 text-xs text-red-600 dark:text-red-400">(Do Not Call)</span>
        ) : (
          <span className="ml-2 text-xs text-green-600 dark:text-green-400" title="OK to Call">✅</span>
        )}
      </div>
    );
  };

  const getEmailDisplay = (email: string | null) => {
    if (!email) return null;
    return (
      <div className="flex items-center">
        <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <a
          href={`mailto:${email}`}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
        >
          {email}
        </a>
      </div>
    );
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
          <p className="text-gray-600 dark:text-gray-300 mb-6">You must be logged in to view customer details.</p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading customer details...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="mb-6">
                <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Error</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
              <button
                onClick={handleBackToCustomers}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Back to Customers
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="mb-6">
                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Customer Not Found</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">The customer you're looking for doesn't exist.</p>
              <button
                onClick={handleBackToCustomers}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Back to Customers
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                     {/* Header */}
           <div className="flex items-center justify-between mb-8">
             <div>
               <button
                 onClick={handleBackToCustomers}
                 className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors duration-200"
               >
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                 </svg>
                 Back to Customers
               </button>
               <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Customer Details</h1>
               <p className="text-gray-600 dark:text-gray-300">View detailed information for {customer.name}</p>
             </div>
                           <div className="flex space-x-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200">
                  Add Note
                </button>
                <button
                  onClick={fetchCustomerDetails}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
           </div>

          {/* Customer Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Customer ID</label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{customer.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">CUS ID</label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{customer.cusId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{customer.name}</p>
                </div>
                {customer.nameFirst && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">First Name</label>
                    <p className="text-gray-800 dark:text-white">{customer.nameFirst}</p>
                  </div>
                )}
                {customer.nameLast && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Last Name</label>
                    <p className="text-gray-800 dark:text-white">{customer.nameLast}</p>
                  </div>
                )}
                {customer.nameSpouse && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Spouse Name</label>
                    <p className="text-gray-800 dark:text-white">{customer.nameSpouse}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    customer.inactive === 1 
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' 
                      : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  }`}>
                    {customer.inactive === 1 ? 'Inactive' : 'Active'}
                  </span>
                </div>
              </div>
            </div>

                         {/* Contact Information */}
             <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
               <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                 <svg className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                 </svg>
                 Contact Information
               </h2>
                              <div className="space-y-4">
                 {customer.contact && (
                   <div>
                     <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Contact Person</label>
                     <p className="text-gray-800 dark:text-white">{customer.contact}</p>
                   </div>
                 )}
                 {getPhoneDisplay(customer.phoneHome, customer.doNotCallPhoneHome) && (
                   <div>
                     <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Home Phone</label>
                     {getPhoneDisplay(customer.phoneHome, customer.doNotCallPhoneHome)}
                   </div>
                 )}
                 {getPhoneDisplay(customer.phoneWork, customer.doNotCallPhoneWork) && (
                   <div>
                     <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Work Phone</label>
                     {getPhoneDisplay(customer.phoneWork, customer.doNotCallPhoneWork)}
                   </div>
                 )}
                 {getPhoneDisplay(customer.phoneOther, customer.doNotCallPhoneOther) && (
                   <div>
                     <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Other Phone</label>
                     {getPhoneDisplay(customer.phoneOther, customer.doNotCallPhoneOther)}
                   </div>
                 )}
                                   {customer.phoneFax && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Fax</label>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <a
                          href={`tel:${customer.phoneFax}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                          {formatPhoneNumber(customer.phoneFax)}
                        </a>
                                                 <span className="ml-2 text-xs text-green-600 dark:text-green-400" title="OK to Call">✅</span>
                      </div>
                    </div>
                  )}
                {getEmailDisplay(customer.emailHome) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Home Email</label>
                    {getEmailDisplay(customer.emailHome)}
                  </div>
                )}
                {getEmailDisplay(customer.emailWork) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Work Email</label>
                    {getEmailDisplay(customer.emailWork)}
                  </div>
                )}
                {getEmailDisplay(customer.emailOther) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Other Email</label>
                    {getEmailDisplay(customer.emailOther)}
                  </div>
                )}
              </div>
            </div>

            {/* Primary Address */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Primary Address
              </h2>
              <div className="space-y-2">
                {customer.addr1 && <p className="text-gray-800 dark:text-white">{customer.addr1}</p>}
                {customer.addr2 && <p className="text-gray-800 dark:text-white">{customer.addr2}</p>}
                <p className="text-gray-800 dark:text-white">
                  {[customer.city, customer.state, customer.post].filter(Boolean).join(', ')}
                </p>
                {customer.county && <p className="text-gray-800 dark:text-white">County: {customer.county}</p>}
                {customer.country && <p className="text-gray-800 dark:text-white">Country: {customer.country}</p>}
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Billing Address
              </h2>
              <div className="space-y-2">
                {customer.billAddr1 && <p className="text-gray-800 dark:text-white">{customer.billAddr1}</p>}
                {customer.billAddr2 && <p className="text-gray-800 dark:text-white">{customer.billAddr2}</p>}
                <p className="text-gray-800 dark:text-white">
                  {[customer.billCity, customer.billState, customer.billPost].filter(Boolean).join(', ')}
                </p>
                {customer.billCounty && <p className="text-gray-800 dark:text-white">County: {customer.billCounty}</p>}
                {customer.billCountry && <p className="text-gray-800 dark:text-white">Country: {customer.billCountry}</p>}
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Financial Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Account Balance</label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{formatCurrency(customer.amtBalAccount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Open Balance</label>
                  <p className="text-gray-800 dark:text-white">{formatCurrency(customer.amtBalOpen)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Credit Limit</label>
                  <p className="text-gray-800 dark:text-white">{formatCurrency(customer.amtCrLimit)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Average Payment Days</label>
                  <p className="text-gray-800 dark:text-white">{customer.daysPaymentAvg} days</p>
                </div>
              </div>
            </div>

            {/* Aged Balances */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Aged Balances
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Current (0 days):</span>
                  <span className="text-gray-800 dark:text-white">{formatCurrency(customer.amtAged0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">1-30 days:</span>
                  <span className="text-gray-800 dark:text-white">{formatCurrency(customer.amtAged1to30)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">31-60 days:</span>
                  <span className="text-gray-800 dark:text-white">{formatCurrency(customer.amtAged31to60)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">61-90 days:</span>
                  <span className="text-gray-800 dark:text-white">{formatCurrency(customer.amtAged61to90)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Over 90 days:</span>
                  <span className="text-gray-800 dark:text-white">{formatCurrency(customer.amtAgedOver90)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notes Card */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Notes
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Note ID</label>
                  <p className="text-gray-800 dark:text-white">{customer.notId}</p>
                </div>
                {customer.notId === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No notes</p>
                  </div>
                                 ) : (
                   <button 
                     onClick={handleShowNotes}
                     disabled={notesLoading}
                     className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {notesLoading ? 'Loading...' : 'Show Notes'}
                   </button>
                 )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">System Information</h3>
                             <div className="space-y-2">
                 <div>
                   <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Created</label>
                   <p className="text-gray-800 dark:text-white">{formatDateTime(customer.dateCreate)}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Last Updated</label>
                   <p className="text-gray-800 dark:text-white">{formatDateTime(customer.dateUpdate)}</p>
                 </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Type</label>
                  <p className="text-gray-800 dark:text-white">{customer.typ || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Employee ID</label>
                  <p className="text-gray-800 dark:text-white">{customer.empId || 'N/A'}</p>
                </div>
              </div>
            </div>

            

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Settings</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Statement Required</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    customer.statementReqd === 1 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                      : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                  }`}>
                    {customer.statementReqd === 1 ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Allow Finance Charges</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    customer.allowFinanceChg === 1 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {customer.allowFinanceChg === 1 ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Allow Special Pricing</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    customer.allowSpecialPri === 1 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                  }`}>
                    {customer.allowSpecialPri === 1 ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

                     {/* Notes Dialog */}
           {showNotesDialog && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
                 {/* Dialog Header */}
                 <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                   <div className="flex items-center">
                     <svg className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                     <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Customer Notes</h2>
                   </div>
                   <button
                     onClick={handleCloseNotesDialog}
                     className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                   >
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </button>
                 </div>

                 {/* Dialog Content */}
                 <div className="p-6 overflow-y-auto flex-1 min-h-0">
                  {notesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <span className="ml-3 text-gray-600 dark:text-gray-300">Loading notes...</span>
                    </div>
                  ) : notesError ? (
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <p className="text-red-600 dark:text-red-400">{notesError}</p>
                    </div>
                  ) : notes.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">No notes found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                                             {notes
                         .sort((a, b) => new Date(b.dateUpdate).getTime() - new Date(a.dateUpdate).getTime())
                         .map((note, index) => (
                         <div key={note.notId} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                           <div className="flex items-start justify-between mb-3">
                             <div>
                               <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Note {index + 1}</h3>
                                                               <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                  <div><span className="font-medium">Employee:</span> {note.empName}</div>
                                  <div><span className="font-medium">Updated:</span> {formatDateTime(note.dateUpdate)}</div>
                                </div>
                             </div>
                           </div>
                           <div className="space-y-2">
                             <div>
                               <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Subject:</span>
                               <p className="text-gray-800 dark:text-white mt-1">{note.subject}</p>
                             </div>
                             <div>
                               <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Description:</span>
                               <p className="text-gray-700 dark:text-gray-300 mt-1">{note.des}</p>
                             </div>
                           </div>
                         </div>
                       ))}
                    </div>
                  )}
                </div>

                                 {/* Dialog Footer */}
                 <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                   <button
                     onClick={handleCloseNotesDialog}
                     className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200"
                   >
                     Close
                   </button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails; 