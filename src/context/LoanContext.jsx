import { createContext, useContext, useState, useEffect } from 'react';
import { 
  requestLoan, 
  getUserLoans, 
  getAllLoans, 
  approveLoan, 
  rejectLoan,
  repayLoan
} from '../services/loans';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const LoanContext = createContext();

export function useLoan() {
  return useContext(LoanContext);
}

export function LoanProvider({ children }) {
  const [userLoans, setUserLoans] = useState([]);
  const [allLoans, setAllLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const refreshUserLoans = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const loans = await getUserLoans(currentUser.uid);
      setUserLoans(loans);
    } catch (error) {
      console.error("Error fetching user loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAllLoans = async () => {
    setLoading(true);
    try {
      const loans = await getAllLoans();
      setAllLoans(loans);
    } catch (error) {
      console.error("Error fetching all loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const createLoanRequest = async (loanData) => {
    try {
      const loanId = await requestLoan(loanData);
      toast.success('Loan request submitted successfully!');
      await refreshUserLoans();
      await refreshAllLoans();
      return loanId;
    } catch (error) {
      toast.error(`Loan request failed: ${error.message}`);
      return false;
    }
  };

  const handleApproveLoan = async (loanId) => {
    try {
      await approveLoan(loanId);
      toast.success('Loan approved successfully!');
      await refreshAllLoans();
      await refreshUserLoans();
      return true;
    } catch (error) {
      toast.error(`Failed to approve loan: ${error.message}`);
      return false;
    }
  };

  const handleRejectLoan = async (loanId) => {
    try {
      await rejectLoan(loanId);
      toast.success('Loan rejected!');
      await refreshAllLoans();
      await refreshUserLoans();
      return true;
    } catch (error) {
      toast.error(`Failed to reject loan: ${error.message}`);
      return false;
    }
  };

  const handleRepayLoan = async (loanId, amount) => {
    try {
      await repayLoan(loanId, amount);
      toast.success('Loan repayment successful!');
      await refreshUserLoans();
      await refreshAllLoans();
      return true;
    } catch (error) {
      toast.error(`Repayment failed: ${error.message}`);
      return false;
    }
  };

  useEffect(() => {
    if (currentUser) {
      refreshUserLoans();
    }
  }, [currentUser]);

  const value = {
    userLoans,
    allLoans,
    loading,
    createLoanRequest,
    handleApproveLoan,
    handleRejectLoan,
    handleRepayLoan,
    refreshUserLoans,
    refreshAllLoans
  };

  return (
    <LoanContext.Provider value={value}>
      {children}
    </LoanContext.Provider>
  );
}