import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gold-accent mb-6">
            Cooperative Society SACCO
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Empowering communities through cooperative savings and credit solutions
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {currentUser ? (
              <Link 
                to="/dashboard"
                className="bg-gold-accent hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/register"
                  className="bg-gold-accent hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition"
                >
                  Join Now
                </Link>
                <Link 
                  to="/login"
                  className="bg-transparent border-2 border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition"
                >
                  Member Login
                </Link>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            
            <h3 className="text-xl font-bold text-white mb-2">Savings</h3>
            <p className="text-gray-400">
              Build your savings with competitive interest rates
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            
            <h3 className="text-xl font-bold text-white mb-2">Loans</h3>
            <p className="text-gray-400">
              Access affordable loans with favorable terms
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            
            <h3 className="text-xl font-bold text-white mb-2">Community</h3>
            <p className="text-gray-400">
              Join a supportive community working towards financial freedom
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}