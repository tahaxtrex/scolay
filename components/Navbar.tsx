
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CartIcon } from './icons';
// import { profile } from 'console';

const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // const handleSignOut = async () => {
  //   await signOut();
  //   navigate('/');
  // };

const handleSignOut = async () => {
  await signOut();
  navigate('/');
};

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Scolay
            </Link>
          </div>
          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(prev => !prev)}
            >
              <svg
                className={`${mobileOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
              <svg
                className={`${mobileOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="hidden md:flex md:space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/schools" className="text-gray-600 hover:text-blue-600 transition-colors">Schools</Link>
            <Link to="/suppliers" className="text-gray-600 hover:text-blue-600 transition-colors">Suppliers</Link>
            {profile?.role === 'admin' && (
              <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">Admin</Link>
            )}
            {profile?.role === 'school_admin' && (
              <Link to="/school-admin" className="text-gray-600 hover:text-blue-600 transition-colors">School Portal</Link>
            )}
            {profile?.role === 'supplier_admin' && (
              <Link to="/supplier-admin" className="text-gray-600 hover:text-blue-600 transition-colors">Supplier Portal</Link>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors">
              <CartIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
               <button onClick={handleSignOut} className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                  Logout
               </button>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                 <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">Login</Link>
                 <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
        {/* Mobile menu panel */}
        <div id="mobile-menu" className={`${mobileOpen ? 'block' : 'hidden'} md:hidden pt-2 pb-4 border-t border-gray-200`}>
          <div className="space-y-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100">Home</Link>
            <Link to="/schools" onClick={() => setMobileOpen(false)} className="block px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100">Schools</Link>
            <Link to="/suppliers" onClick={() => setMobileOpen(false)} className="block px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100">Suppliers</Link>
            {profile?.role === 'admin' && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100">Admin</Link>
            )}
            {profile?.role === 'school_admin' && (
              <Link to="/school-admin" onClick={() => setMobileOpen(false)} className="block px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100">School Portal</Link>
            )}
            {profile?.role === 'supplier_admin' && (
              <Link to="/supplier-admin" onClick={() => setMobileOpen(false)} className="block px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100">Supplier Portal</Link>
            )}
          </div>
          <div className="mt-3 border-t border-gray-200 pt-3">
            {user ? (
              <button
                onClick={() => { setMobileOpen(false); handleSignOut(); }}
                className="w-full text-left block px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">Login</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-3 py-2 rounded-md text-white bg-orange-500 hover:bg-orange-600">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;