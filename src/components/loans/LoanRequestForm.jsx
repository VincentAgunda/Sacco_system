import React, { useState } from 'react';
import { useLoan } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function LoanRequestForm() {
  const [amount, setAmount] = useState(0);
  const [period, setPeriod] = useState(6); // months
  const [purpose, setPurpose] = useState('');
  const [processing, setProcessing] = useState(false);
  const { createLoanRequest } = useLoan();
  const { currentUser } = useAuth();

  const interestRate = 12; // 12% annual interest
  const monthlyInterest = interestRate / 12;
  const totalAmount = amount * Math.pow(1 + monthlyInterest/100, period);
  const monthlyPayment = totalAmount / period;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please log in to request a loan');
      return;
    }
    
    if (amount < 1000) {
      toast.error('Minimum loan amount is ksh 1000');
      return;
    }
    
    if (period < 1) {
      toast.error('Loan period must be at least 1 month');
      return;
    }
    
    setProcessing(true);
    
    try {
      const loanData = {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Member',
        userEmail: currentUser.email,
        amount,
        period,
        purpose,
        interestRate,
        status: 'pending'
      };
      
      await createLoanRequest(loanData);
      setAmount(0);
      setPeriod(6);
      setPurpose('');
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
      <h2 className="text-xl font-semibold text-gold-accent mb-4">Request Loan</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Loan Amount (ksh)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            min="1000"
            step="100"
            placeholder="Enter amount"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-accent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Repayment Period (months)</label>
          <input
            type="number"
            value={period}
            onChange={(e) => setPeriod(parseInt(e.target.value) || 6)}
            min="1"
            max="36"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-accent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Purpose</label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="What will you use the loan for?"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-accent"
            rows="3"
            required
          />
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-gold-accent font-medium mb-2">Loan Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-400">Interest Rate:</span>
            <span className="text-right">{interestRate}% per annum</span>
            
            <span className="text-gray-400">Monthly Payment:</span>
            <span className="text-right">ksh {monthlyPayment.toFixed(2)}</span>
            
            <span className="text-gray-400">Total Repayable:</span>
            <span className="text-right">ksh {totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={processing}
          className="w-full bg-gold-accent hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50"
        >
          {processing ? 'Submitting Request...' : 'Request Loan'}
        </button>
      </form>
    </div>
  );
}