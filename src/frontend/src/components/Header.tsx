import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { hasAdminRole } from '../utils/roleUtils';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

    // Reset avatar error when user changes
  useEffect(() => {
    setAvatarError(false);
  }, [user?.picture]);

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Avatar image failed to load (likely rate limited):', user?.picture);
    setAvatarError(true);
    e.currentTarget.style.display = 'none';
  };

  const handleAvatarLoad = () => {
    setAvatarError(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
                                {/* Logo and Brand */}
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <a href="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
                            <img
                              src={isDarkMode ? "/logo_dark.png" : "/logo.png"}
                              alt="RDK CRM Logo"
                              className="h-14 w-auto"
                              onError={(e) => {
                                console.error('Logo failed to load');
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </a>
                        </div>
                      </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Home
            </a>
            {isAuthenticated && (
              <>
                                            <a
                              href="/customers"
                              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                              Customers
                            </a>
                <a
                  href="/calllogs"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Call Logs
                </a>
                                                  {user?.['dev-uneclc7juqwrway0.us.auth0.com/roles']?.includes('Admin') && (
                   <a
                     href="/admin"
                     className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                   >
                     Admin
                   </a>
                 )}
                 
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600"
                      onError={handleAvatarError}
                      onLoad={handleAvatarLoad}
                    />
                  ) : null}
                  {/* Fallback avatar */}
                  <div className={`w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600 bg-blue-500 flex items-center justify-center text-white text-sm font-semibold ${user?.picture && !avatarError ? 'hidden' : ''} avatar-fallback`}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Welcome, {user?.name || user?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Log In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
              {/* Dark Mode Toggle for Mobile */}
              <button
                onClick={toggleDarkMode}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <div className="flex items-center space-x-2">
                  {isDarkMode ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                      <span>Dark Mode</span>
                    </>
                  )}
                </div>
              </button>
              
              <a
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              {isAuthenticated && (
                <>
                                                <a
                                href="/customers"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                Customers
                              </a>
                  <a
                    href="/calllogs"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Call Logs
                  </a>
                                     {user?.['dev-uneclc7juqwrway0.us.auth0.com/roles']?.includes('Admin') && (
                     <a
                       href="/admin"
                       className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                       onClick={() => setIsMenuOpen(false)}
                     >
                       Admin
                     </a>
                   )}
                  
                </>
              )}
              {isAuthenticated ? (
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-3 mb-3">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600"
                        onError={handleAvatarError}
                        onLoad={handleAvatarLoad}
                      />
                    ) : null}
                    {/* Fallback avatar */}
                    <div className={`w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600 bg-blue-500 flex items-center justify-center text-white text-sm font-semibold ${user?.picture && !avatarError ? 'hidden' : ''} avatar-fallback`}>
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Welcome, {user?.name || user?.email}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 w-full"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    loginWithRedirect();
                    setIsMenuOpen(false);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 w-full"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 