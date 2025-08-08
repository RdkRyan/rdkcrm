import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { createApiService, Customer, CustomersResponse, PaginationMetadata } from '../services/apiService';

const Customers: React.FC = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [paginationMetadata, setPaginationMetadata] = useState<PaginationMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);

  // Ref for scrolling to top of customers list
  const customersListRef = useRef<HTMLDivElement>(null);
  const customersGridRef = useRef<HTMLDivElement>(null);

  // Create API service with the getAccessTokenSilently function
  const apiService = createApiService(() =>
    getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.REACT_APP_AUTH0_AUDIENCE
      }
    })
  );

  const fetchCustomers = async (page: number = 1, itemsPerPage: number = 10, skip?: number, search: string = '', includeInactive: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert to 0-based page index for API
      const apiPage = page - 1;
      const response: CustomersResponse = await apiService.getContacts(apiPage, itemsPerPage, skip, search, includeInactive);
      
      setCustomers(response.items);
      setPaginationMetadata(response.metadata);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to fetch customers: ${errorMessage}`);
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Only fetch if we're not restoring pagination state
      const savedPage = sessionStorage.getItem('customersCurrentPage');
      if (!savedPage) {
        fetchCustomers(currentPage, itemsPerPage, undefined, searchTerm, includeInactive);
      }
    }
  }, [isAuthenticated, currentPage, itemsPerPage]);

    // Handle pagination and search state restoration when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      const savedPage = sessionStorage.getItem('customersCurrentPage');
      const savedItemsPerPage = sessionStorage.getItem('customersItemsPerPage');
      const savedSearchTerm = sessionStorage.getItem('customersSearchTerm');
      const savedIncludeInactive = sessionStorage.getItem('customersIncludeInactive');
      
      // Restore search state
      if (savedSearchTerm !== null) {
        setSearchTerm(savedSearchTerm);
        sessionStorage.removeItem('customersSearchTerm');
      }
      if (savedIncludeInactive !== null) {
        setIncludeInactive(savedIncludeInactive === 'true');
        sessionStorage.removeItem('customersIncludeInactive');
      }
      
      if (savedPage && savedItemsPerPage) {
        const page = parseInt(savedPage);
        const itemsPerPage = parseInt(savedItemsPerPage);
        
        setCurrentPage(page);
        setItemsPerPage(itemsPerPage);
        
        // Clear the saved state
        sessionStorage.removeItem('customersCurrentPage');
        sessionStorage.removeItem('customersItemsPerPage');
        
        // Force a fresh data fetch with the restored pagination and search state
        const currentSearchTerm = savedSearchTerm !== null ? savedSearchTerm : searchTerm;
        const currentIncludeInactive = savedIncludeInactive !== null ? savedIncludeInactive === 'true' : includeInactive;
        fetchCustomers(page, itemsPerPage, undefined, currentSearchTerm, currentIncludeInactive);
      } else if (savedSearchTerm !== null || savedIncludeInactive !== null) {
        // If we have search state but no pagination state, fetch with current pagination
        const currentSearchTerm = savedSearchTerm !== null ? savedSearchTerm : searchTerm;
        const currentIncludeInactive = savedIncludeInactive !== null ? savedIncludeInactive === 'true' : includeInactive;
        fetchCustomers(currentPage, itemsPerPage, undefined, currentSearchTerm, currentIncludeInactive);
      }
    }
  }, [isAuthenticated]);

  // Handle scroll position restoration when component mounts
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('customersScrollPosition');
    
    if (savedScrollPosition && customers.length > 0 && !loading) {
      sessionStorage.removeItem('customersScrollPosition');
      
      // Use a shorter delay and smooth behavior
      setTimeout(() => {
        const scrollPercentage = parseFloat(savedScrollPosition);
        const newScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetScrollPosition = Math.max(0, (scrollPercentage / 100) * newScrollHeight);
        
        window.scrollTo({
          top: targetScrollPosition,
          behavior: 'smooth'
        });
      }, 300); // Much shorter delay
    }
  }, [customers.length, loading]);

  // Scroll to top when customers data changes (new page loaded)
  useEffect(() => {
    if (customers.length > 0 && !loading) {
      // Only scroll to top for pagination changes, not for initial load or scroll restoration
      const savedScrollPosition = sessionStorage.getItem('customersScrollPosition');
      const isPaginationChange = sessionStorage.getItem('isPaginationChange');
      
      if (!savedScrollPosition && isPaginationChange) {
        // Scroll to top of results when pagination changes
        setTimeout(() => {
          customersGridRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          // Also scroll the window to ensure we're at the top
          window.scrollTo({
            top: customersGridRef.current?.offsetTop ? customersGridRef.current.offsetTop - 100 : 0,
            behavior: 'smooth'
          });
        }, 100);
        // Clear the pagination flag
        sessionStorage.removeItem('isPaginationChange');
      }
    }
  }, [customers, loading]);

  // Use server-side pagination metadata
  const totalPages = paginationMetadata?.totalPages || 0;
  const totalCount = paginationMetadata?.totalCount || 0;
  const startIndex = paginationMetadata ? (paginationMetadata.page * paginationMetadata.limit) + 1 : 0;
  const endIndex = startIndex + (customers.length - 1);
  const currentCustomers = customers; // No need to slice since we get the exact page from API

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Set flag to indicate this is a pagination change
    sessionStorage.setItem('isPaginationChange', 'true');
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
    // Set flag to indicate this is a pagination change
    sessionStorage.setItem('isPaginationChange', 'true');
    fetchCustomers(1, newItemsPerPage, undefined, searchTerm, includeInactive);
  };

  // Handle search input change (no API call)
  const handleSearchInputChange = (searchValue: string) => {
    setSearchTerm(searchValue);
  };

  // Handle search button click
  const handleSearchButtonClick = () => {
    setCurrentPage(1); // Reset to first page when searching
    // Don't set pagination change flag for search - we don't want to scroll
    fetchCustomers(1, itemsPerPage, undefined, searchTerm, includeInactive);
    
    // Save search state to sessionStorage
    sessionStorage.setItem('customersSearchTerm', searchTerm);
    sessionStorage.setItem('customersIncludeInactive', includeInactive.toString());
  };

  // Handle include inactive toggle (no API call)
  const handleIncludeInactiveToggle = (include: boolean) => {
    setIncludeInactive(include);
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

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
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
          <p className="text-gray-600 dark:text-gray-300 mb-6">You must be logged in to view customers.</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Customers</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your customers</p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by Customer Name"
                    value={searchTerm}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchButtonClick();
                      }
                    }}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Include Inactive Toggle */}
              <div className="flex items-center space-x-3">
                <label className="text-sm text-gray-600 dark:text-gray-300">Include Inactive:</label>
                <button
                  onClick={() => handleIncludeInactiveToggle(!includeInactive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    includeInactive ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-500'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                      includeInactive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearchButtonClick}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading customers...</span>
            </div>
          )}

          {/* Customers List */}
          {!loading && customers.length > 0 && (
            <div className="space-y-4" ref={customersListRef}>
              {/* Pagination Info and Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                     <div className="text-sm text-gray-600 dark:text-gray-300">
                     Showing {startIndex}-{endIndex} of {totalCount} customer{totalCount !== 1 ? 's' : ''}
                   </div>
                  <div className="flex items-center space-x-2">
                    <label htmlFor="itemsPerPage" className="text-sm text-gray-600 dark:text-gray-300">
                      Items per page:
                    </label>
                    <select
                      id="itemsPerPage"
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>

                             {/* Customers Grid */}
               <div className="grid gap-4" ref={customersGridRef}>
                 {currentCustomers.map((customer, index) => (
                                                          <Link
                       key={customer.id || customer.cusId || `customer-${index}`}
                       to={`/customers/${customer.id || customer.cusId || `customer-${index}`}`}
                       onClick={() => {
                         // Save current scroll position as percentage before navigating
                         const scrollPercentage = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                         sessionStorage.setItem('customersScrollPosition', scrollPercentage.toString());
                         // Also save current pagination state
                         sessionStorage.setItem('customersCurrentPage', currentPage.toString());
                         sessionStorage.setItem('customersItemsPerPage', itemsPerPage.toString());
                       }}
                       className="block bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                     >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                                                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                           {customer.name || customer.nameFirst || customer.nameLast || 'Unknown Customer'}
                         </h3>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                          {(customer.emailWork || customer.emailOther) && (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {customer.emailWork || customer.emailOther}
                            </div>
                          )}
                                                     {(customer.phoneWork || customer.phoneOther || customer.phoneHome || customer.phoneFax) && (
                             <div className="space-y-1">
                               {customer.phoneWork && (
                                 <div className="flex items-center">
                                   <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                   </svg>
                                   <span className="text-sm text-gray-600 dark:text-gray-400">Work:</span>
                                   <span className="ml-1">{formatPhoneNumber(customer.phoneWork)}</span>
                                   {customer.doNotCallPhoneWork === 1 ? (
                                     <span className="ml-2 text-xs text-red-600 dark:text-red-400">(Do Not Call)</span>
                                   ) : (
                                     <span className="ml-2 text-xs text-green-600 dark:text-green-400" title="OK to Call">✅</span>
                                   )}
                                 </div>
                               )}
                               {customer.phoneOther && (
                                 <div className="flex items-center">
                                   <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                   </svg>
                                   <span className="text-sm text-gray-600 dark:text-gray-400">Other:</span>
                                   <span className="ml-1">{formatPhoneNumber(customer.phoneOther)}</span>
                                   {customer.doNotCallPhoneOther === 1 ? (
                                     <span className="ml-2 text-xs text-red-600 dark:text-red-400">(Do Not Call)</span>
                                   ) : (
                                     <span className="ml-2 text-xs text-green-600 dark:text-green-400" title="OK to Call">✅</span>
                                   )}
                                 </div>
                               )}
                               {customer.phoneHome && (
                                 <div className="flex items-center">
                                   <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                   </svg>
                                   <span className="text-sm text-gray-600 dark:text-gray-400">Home:</span>
                                   <span className="ml-1">{formatPhoneNumber(customer.phoneHome)}</span>
                                   {customer.doNotCallPhoneHome === 1 ? (
                                     <span className="ml-2 text-xs text-red-600 dark:text-red-400">(Do Not Call)</span>
                                   ) : (
                                     <span className="ml-2 text-xs text-green-600 dark:text-green-400" title="OK to Call">✅</span>
                                   )}
                                 </div>
                               )}
                               {customer.phoneFax && (
                                 <div className="flex items-center">
                                   <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                   </svg>
                                   <span className="text-sm text-gray-600 dark:text-gray-400">Fax:</span>
                                   <span className="ml-1">{formatPhoneNumber(customer.phoneFax)}</span>
                                   <span className="ml-2 text-xs text-green-600 dark:text-green-400" title="OK to Call">✅</span>
                                 </div>
                               )}
                             </div>
                           )}
                          {customer.addr1 && (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {customer.addr1}
                              {customer.city && customer.state && (
                                <span className="ml-1">
                                  , {customer.city}, {customer.state}
                                  {customer.post && ` ${customer.post}`}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-end space-y-2">
                                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                           ID: {customer.id || customer.cusId || 'N/A'}
                         </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.inactive === 1 
                            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' 
                            : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        }`}>
                          {customer.inactive === 1 ? 'Inactive' : 'Active'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination Navigation */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2" aria-label="Pagination">
                                         {/* Previous Button */}
                     <button
                       onClick={() => handlePageChange(currentPage - 1)}
                       disabled={!paginationMetadata?.hasPreviousPage}
                       className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       Previous
                     </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                                         {/* Next Button */}
                     <button
                       onClick={() => handlePageChange(currentPage + 1)}
                       disabled={!paginationMetadata?.hasNextPage}
                       className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       Next
                     </button>
                  </nav>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && customers.length === 0 && !error && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No customers</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No customers found in the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers; 