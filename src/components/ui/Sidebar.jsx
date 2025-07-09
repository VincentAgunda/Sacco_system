import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { userRole } = useAuth();

  return (
    <div 
      className={`sidebar bg-gray-900 w-64 min-h-screen border-r border-gray-800 
                 fixed md:relative z-30 transform transition-transform duration-300
                 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gold-accent">SACCO Dashboard</h1>
        <button 
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setMobileOpen(false)}
        >
          ✕
        </button>
      </div>
      
      <nav className="mt-6 px-4">
        <div className="space-y-1">
          <NavLink 
            to="" 
            end
            className={({isActive}) => 
              `flex items-center px-4 py-3 rounded-lg transition ${
                isActive 
                  ? 'bg-gold-accent text-gray-900 font-medium' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
            onClick={() => setMobileOpen(false)}
          >
            Dashboard Home
          </NavLink>
          
          <NavLink 
            to="make-payment" 
            className={({isActive}) => 
              `flex items-center px-4 py-3 rounded-lg transition ${
                isActive 
                  ? 'bg-gold-accent text-gray-900 font-medium' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
            onClick={() => setMobileOpen(false)}
          >
            Make Payment
          </NavLink>
          
          <NavLink 
            to="request-loan" 
            className={({isActive}) => 
              `flex items-center px-4 py-3 rounded-lg transition ${
                isActive 
                  ? 'bg-gold-accent text-gray-900 font-medium' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
            onClick={() => setMobileOpen(false)}
          >
            Request Loan
          </NavLink>
          
          <NavLink 
            to="history" 
            className={({isActive}) => 
              `flex items-center px-4 py-3 rounded-lg transition ${
                isActive 
                  ? 'bg-gold-accent text-gray-900 font-medium' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
            onClick={() => setMobileOpen(false)}
          >
            Payment History
          </NavLink>
          
          {userRole === 'admin' && (
            <>
              <div className="pt-4 mt-4 border-t border-gray-800">
                <h3 className="text-xs uppercase text-gray-500 font-medium px-4 mb-2">Admin</h3>
                <NavLink 
                  to="admin/users" 
                  className={({isActive}) => 
                    `flex items-center px-4 py-3 rounded-lg transition ${
                      isActive 
                        ? 'bg-gold-accent text-gray-900 font-medium' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  Manage Users
                </NavLink>
                <NavLink 
                  to="admin/payments" 
                  className={({isActive}) => 
                    `flex items-center px-4 py-3 rounded-lg transition ${
                      isActive 
                        ? 'bg-gold-accent text-gray-900 font-medium' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  All Payments
                </NavLink>
                <NavLink 
                  to="admin/loans" 
                  className={({isActive}) => 
                    `flex items-center px-4 py-3 rounded-lg transition ${
                      isActive 
                        ? 'bg-gold-accent text-gray-900 font-medium' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  Loan Management
                </NavLink>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}