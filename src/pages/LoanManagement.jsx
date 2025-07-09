import React, { useEffect } from 'react';
import { useLoan } from '../context/LoanContext';
import LoanList from '../components/loans/LoanList';
import { toast } from 'react-hot-toast';

export default function LoanManagementPage() {
  const { allLoans, loading, refreshAllLoans, handleApproveLoan, handleRejectLoan } = useLoan();

  useEffect(() => {
    refreshAllLoans();
  }, []);

  const handleApprove = async (loanId) => {
    try {
      await handleApproveLoan(loanId);
      toast.success('Loan approved successfully!');
    } catch (error) {
      toast.error(`Failed to approve loan: ${error.message}`);
    }
  };

  const handleReject = async (loanId) => {
    try {
      await handleRejectLoan(loanId);
      toast.success('Loan rejected!');
    } catch (error) {
      toast.error(`Failed to reject loan: ${error.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-gold-accent mb-2">Loan Management</h1>
        <p className="text-gray-400">Review and manage loan applications</p>
      </div>
      
      {loading ? (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      ) : (
        <LoanList 
          loans={allLoans} 
          adminView={true} 
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}