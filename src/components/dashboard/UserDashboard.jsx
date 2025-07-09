import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserPayments } from '../../services/payments';
import { useLoan } from '../../context/LoanContext';
import PaymentHistory from '../ui/PaymentHistory';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const [userStats, setUserStats] = useState({
    accountBalance: 0,
    totalSavings: 0,
    pendingLoans: 0,
    activeLoans: 0,
    loanBalance: 0
  });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { userLoans } = useLoan();

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!currentUser) return;
      
      try {
        const payments = await getUserPayments(currentUser.uid);
        const totalSavings = payments.reduce((sum, payment) => sum + payment.amount, 0);
        
        // Calculate loan stats
        const pendingLoans = userLoans.filter(loan => loan.status === 'pending').length;
        const activeLoans = userLoans.filter(loan => loan.status === 'active');
        const loanBalance = activeLoans.reduce((sum, loan) => sum + (loan.balance || loan.amount), 0);
        
        // Account balance is savings minus active loan balances
        const accountBalance = totalSavings - loanBalance;
        
        setUserStats({
          accountBalance,
          totalSavings,
          pendingLoans,
          activeLoans: activeLoans.length,
          loanBalance
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setUserStats({
          accountBalance: 0,
          totalSavings: 0,
          pendingLoans: 0,
          activeLoans: 0,
          loanBalance: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [currentUser, userLoans]);

  if (loading) return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="h-64 bg-gray-800 rounded-xl"></div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gold-accent">Member Dashboard</h1>
        <Link 
          to="/dashboard/request-loan" 
          className="bg-gold-accent hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg text-sm"
        >
          Request Loan
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm mb-1">Account Balance</h3>
          <p className="text-3xl font-bold text-white">
            ksh{userStats.accountBalance.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm mb-1">Total Savings</h3>
          <p className="text-3xl font-bold text-white">
            ksh{userStats.totalSavings.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm mb-1">Loan Balance</h3>
          <p className="text-3xl font-bold text-white">
            ksh{userStats.loanBalance.toLocaleString()}
          </p>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-gray-400">Pending: {userStats.pendingLoans}</span>
            <span className="text-gray-400">Active: {userStats.activeLoans}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gold-accent mb-4">Your Loans</h2>
        {userLoans.length > 0 ? (
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Loan ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Repaid</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {userLoans.map(loan => (
                    <tr key={loan.id} className="hover:bg-gray-750">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {loan.id.substring(0, 6)}...
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        ksh{loan.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          loan.status === 'pending' ? 'bg-yellow-800 text-yellow-100' :
                          loan.status === 'active' ? 'bg-green-800 text-green-100' :
                          loan.status === 'rejected' ? 'bg-red-800 text-red-100' :
                          'bg-blue-800 text-blue-100'
                        }`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        ksh{loan.balance?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        ksh{(loan.totalRepaid || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {loan.status === 'active' && (
                          <Link 
                            to={`/dashboard/repay-loan/${loan.id}`}
                            className="text-gold-accent hover:text-yellow-600"
                          >
                            Repay
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg text-center">
            <p className="text-gray-400">You don't have any loans</p>
            <Link 
              to="/dashboard/request-loan" 
              className="text-gold-accent hover:text-yellow-600 mt-2 inline-block"
            >
              Request a loan
            </Link>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <PaymentHistory />
      </div>
    </div>
  );
}