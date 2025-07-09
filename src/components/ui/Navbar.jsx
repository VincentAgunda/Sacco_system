import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/auth';
import { toast } from 'react-hot-toast';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gold-accent">SACCO</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                {currentUser && (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="text-gray-300 hover:text-gold-accent px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/dashboard/make-payment" 
                      className="text-gray-300 hover:text-gold-accent px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                      Make Payment
                    </Link>
                    <Link 
                      to="/dashboard/request-loan" 
                      className="text-gray-300 hover:text-gold-accent px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                      Request Loan
                    </Link>
                    {userRole === 'admin' && (
                      <Link 
                        to="/dashboard/admin" 
                        className="text-gray-300 hover:text-gold-accent px-3 py-2 rounded-md text-sm font-medium transition"
                      >
                        Admin Panel
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="md:hidden mr-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
            
            {currentUser ? (
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  {currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gold-accent hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg text-sm transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link 
                  to="/login" 
                  className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm transition"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gold-accent hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg text-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {currentUser && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/dashboard/make-payment" 
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Make Payment
                </Link>
                <Link 
                  to="/dashboard/request-loan" 
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Request Loan
                </Link>
                {userRole === 'admin' && (
                  <Link 
                    to="/dashboard/admin" 
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="pt-4 border-t border-gray-700">
                  <span className="block px-3 py-2 text-gray-400 text-sm">
                    {currentUser.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
            {!currentUser && (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}