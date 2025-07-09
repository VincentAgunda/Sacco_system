import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

export default function LoanList({ loans, adminView = false, onApprove, onReject }) {
  const { currentUser } = useAuth();

  if (!loans || loans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No loans found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
      <h2 className="text-xl font-semibold text-gold-accent mb-4">
        {adminView ? 'All Loans' : 'Your Loans'}
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {adminView && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Member</th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Repaid</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loans.map(loan => (
              <tr key={loan.id} className="hover:bg-gray-750">
                {adminView && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {loan.userName} ({loan.userEmail})
                  </td>
                )}
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {loan.createdAt && format(loan.createdAt, 'dd MMM yyyy')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  ksh{loan.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    loan.status === 'pending' ? 'bg-yellow-800 text-yellow-100' :
                    loan.status === 'active' ? 'bg-green-800 text-green-100' :
                    loan.status === 'rejected' ? 'bg-red-800 text-red-100' :
                    loan.status === 'completed' ? 'bg-blue-800 text-blue-100' :
                    'bg-gray-700 text-gray-300'
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
                  {/* Only show repay button for the loan owner */}
                  {loan.status === 'active' && currentUser?.uid === loan.userId && (
                    <Link 
                      to={`/dashboard/repay-loan/${loan.id}`}
                      className="text-gold-accent hover:text-yellow-600 mr-3"
                    >
                      Repay
                    </Link>
                  )}
                  {adminView && loan.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => onApprove(loan.id)}
                        className="text-green-500 hover:text-green-700 mr-2"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => onReject(loan.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}