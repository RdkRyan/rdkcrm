import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { hasAdminRole } from '../utils/roleUtils';

const Header: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [userFullyLoaded, setUserFullyLoaded] = useState(false);

  // Debug logging
  console.log('Header - Auth state:', { isAuthenticated, isLoading, user: user?.email });
  console.log('Header - User object:', user);
  console.log('Header - Admin role check:', hasAdminRole(user));
     console.log('Header - Roles from user:', user?.['dev-uneclc7juqwrway0.us.auth0.com/roles']);
  console.log('Header - All user properties:', Object.keys(user || {}));
  console.log('Header - User app_metadata:', user?.app_metadata);
  console.log('Header - User roles property:', user?.roles);
  
     // More specific debugging
   const rolesKey = 'dev-uneclc7juqwrway0.us.auth0.com/roles';
  console.log('Header - Direct roles access:', user?.[rolesKey]);
  console.log('Header - Type of roles:', typeof user?.[rolesKey]);
  console.log('Header - Is roles array?', Array.isArray(user?.[rolesKey]));
  console.log('Header - Roles length:', user?.[rolesKey]?.length);

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

  // Debug user object changes
  useEffect(() => {
    console.log('Header - User object changed:', user);
         console.log('Header - User roles on change:', user?.['dev-uneclc7juqwrway0.us.auth0.com/roles']);
    
         // Check if user is fully loaded (has roles)
     if (user && user['dev-uneclc7juqwrway0.us.auth0.com/roles']) {
      setUserFullyLoaded(true);
      console.log('Header - User fully loaded with roles');
    }
  }, [user]);

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Avatar image failed to load (likely rate limited):', user?.picture);
    setAvatarError(true);
    e.currentTarget.style.display = 'none';
  };

  const handleAvatarLoad = () => {
    console.log('Avatar loaded successfully:', user?.picture);
    setAvatarError(false);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
                <img 
                  src="/logo.png" 
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
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Home
            </a>
            {isAuthenticated && (
              <>
                <a
                  href="/contacts"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Contacts
                </a>
                <a
                  href="/calllogs"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Call Logs
                </a>
                                                  {user?.['dev-uneclc7juqwrway0.us.auth0.com/roles']?.includes('Admin') && (
                   <a
                     href="/admin"
                     className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                   >
                     Admin
                   </a>
                 )}
                                   {/* Temporary debug indicator */}
                  <span className="text-xs text-red-500">
                    Direct Check: {user?.['dev-uneclc7juqwrway0.us.auth0.com/roles']?.includes('Admin') ? 'ADMIN' : 'NO ADMIN'}
                    | Roles: {JSON.stringify(user?.['dev-uneclc7juqwrway0.us.auth0.com/roles'])}
                    | User exists: {user ? 'YES' : 'NO'}
                  </span>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                      onError={handleAvatarError}
                      onLoad={handleAvatarLoad}
                    />
                  ) : null}
                  {/* Fallback avatar */}
                  <div className={`w-8 h-8 rounded-full border-2 border-gray-200 bg-blue-500 flex items-center justify-center text-white text-sm font-semibold ${user?.picture && !avatarError ? 'hidden' : ''} avatar-fallback`}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-gray-700">
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
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              {isAuthenticated && (
                <>
                  <a
                    href="/contacts"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contacts
                  </a>
                  <a
                    href="/calllogs"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Call Logs
                  </a>
                                     {user?.['dev-uneclc7juqwrway0.us.auth0.com/roles']?.includes('Admin') && (
                     <a
                       href="/admin"
                       className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                       onClick={() => setIsMenuOpen(false)}
                     >
                       Admin
                     </a>
                   )}
                  <a
                    href="/user-debug"
                    className="text-yellow-600 hover:text-yellow-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Debug User
                  </a>
                </>
              )}
              {isAuthenticated ? (
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-3 mb-3">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border-2 border-gray-200"
                        onError={handleAvatarError}
                        onLoad={handleAvatarLoad}
                      />
                    ) : null}
                    {/* Fallback avatar */}
                    <div className={`w-8 h-8 rounded-full border-2 border-gray-200 bg-blue-500 flex items-center justify-center text-white text-sm font-semibold ${user?.picture && !avatarError ? 'hidden' : ''} avatar-fallback`}>
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm text-gray-700">
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