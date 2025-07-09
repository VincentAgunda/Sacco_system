import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function LoanRepaymentPage() {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const { userLoans, handleRepayLoan } = useLoan();
  const { currentUser } = useAuth();
  const [loan, setLoan] = useState(null);
  const [amount, setAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [maxAmount, setMaxAmount] = useState(0);
  const [totalOwed, setTotalOwed] = useState(0);
  const [totalRepaid, setTotalRepaid] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    if (userLoans.length > 0 && loanId) {
      const foundLoan = userLoans.find(loan => loan.id === loanId);
      if (foundLoan) {
        setLoan(foundLoan);
        setMaxAmount(foundLoan.balance);
        setTotalOwed(foundLoan.amount + foundLoan.totalInterest);
        setTotalRepaid(foundLoan.totalRepaid || 0);
        setTotalInterest(foundLoan.totalInterest || 0);
      }
    }
  }, [userLoans, loanId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please log in to make repayments');
      return;
    }
    
    if (amount < 1) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (amount > maxAmount) {
      toast.error(`Amount cannot exceed loan balance of ksh${maxAmount.toFixed(2)}`);
      return;
    }
    
    setProcessing(true);
    try {
      const success = await handleRepayLoan(loan.id, amount);
      if (success) {
        toast.success(`Repayment of ksh ${amount.toLocaleString()} successful!`);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(`Repayment failed: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (!loan) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-6">
          <h1 className="text-2xl font-bold text-gold-accent mb-2">Loan Repayment</h1>
          <p className="text-gray-400">Loading loan details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-gold-accent mb-2">Repay Loan</h1>
        <p className="text-gray-400">Loan ID: {loan.id}</p>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-gray-400 text-sm">Original Amount</h3>
            <p className="text-lg">ksh{loan.amount.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm">Current Balance</h3>
            <p className="text-lg">ksh{loan.balance.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm">Interest Rate</h3>
            <p className="text-lg">{loan.interestRate}% per annum</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm">Status</h3>
            <p className="text-lg capitalize">{loan.status}</p>
          </div>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <h3 className="text-gray-400 text-sm">Total Owed</h3>
              <p className="text-lg font-bold">ksh{totalOwed.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Total Repaid</h3>
              <p className="text-lg font-bold text-green-500">ksh{totalRepaid.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Interest Paid</h3>
              <p className="text-lg font-bold">ksh{totalInterest.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Repayment Amount (ksh)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              min="1"
              step="1"
              max={maxAmount}
              placeholder={`Max: ksh${maxAmount.toFixed(2)}`}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-accent"
              required
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Min: ksh 1</span>
              <span>Max: ksh{maxAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-gold-accent hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {processing ? 'Processing Repayment...' : `Repay ksh ${amount.toLocaleString()}`}
          </button>
        </form>
      </div>
    </div>
  );
}