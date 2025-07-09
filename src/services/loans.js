import { db } from '../firebase/firebaseInit';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';

// Helper function to calculate loan balance with simple interest
const calculateLoanBalance = (loan) => {
  if (!loan || loan.status !== 'active') return loan?.amount || 0;
  
  // Handle different timestamp formats
  let approvedDate;
  if (loan.approvedAt?.toDate) {
    approvedDate = loan.approvedAt.toDate();
  } else if (loan.approvedAt?.seconds) {
    approvedDate = new Date(loan.approvedAt.seconds * 1000);
  } else {
    return loan.amount;
  }
  
  const now = new Date();
  const monthsElapsed = Math.floor((now - approvedDate) / (1000 * 60 * 60 * 24 * 30));
  const yearlyInterestRate = loan.interestRate / 100;
  
  // Calculate simple interest: Principal * Rate * Time
  const interest = loan.amount * yearlyInterestRate * (monthsElapsed / 12);
  const totalOwed = loan.amount + interest;
  
  // Subtract repayments
  const repaidAmount = loan.repayments?.reduce((sum, r) => sum + r.amount, 0) || 0;
  
  return Math.max(0, totalOwed - repaidAmount);
};

// Get total amount repaid for a loan
export const getTotalRepaid = (loan) => {
  return loan.repayments?.reduce((sum, r) => sum + r.amount, 0) || 0;
};

// Get total interest paid for a loan
export const getTotalInterest = (loan) => {
  if (!loan || loan.status !== 'active') return 0;
  
  let approvedDate;
  if (loan.approvedAt?.toDate) {
    approvedDate = loan.approvedAt.toDate();
  } else if (loan.approvedAt?.seconds) {
    approvedDate = new Date(loan.approvedAt.seconds * 1000);
  } else {
    return 0;
  }
  
  const now = new Date();
  const monthsElapsed = Math.floor((now - approvedDate) / (1000 * 60 * 60 * 24 * 30));
  const yearlyInterestRate = loan.interestRate / 100;
  
  return loan.amount * yearlyInterestRate * (monthsElapsed / 12);
};

export async function requestLoan(loanData) {
  try {
    const loanRef = doc(collection(db, 'loans'));
    await setDoc(loanRef, {
      ...loanData,
      status: 'pending',
      createdAt: serverTimestamp(),
      repayments: []
    });
    return loanRef.id;
  } catch (error) {
    console.error("Error requesting loan:", error);
    throw error;
  }
}

export async function getUserLoans(userId) {
  try {
    const loansRef = collection(db, 'loans');
    const q = query(loansRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const loans = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const loan = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt?.seconds * 1000),
        approvedAt: data.approvedAt?.toDate ? data.approvedAt.toDate() : new Date(data.approvedAt?.seconds * 1000),
      };
      loan.balance = calculateLoanBalance(loan);
      loan.totalRepaid = getTotalRepaid(loan);
      loan.totalInterest = getTotalInterest(loan);
      return loan;
    });
    
    return loans.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error fetching user loans:", error);
    return [];
  }
}

export async function getAllLoans() {
  try {
    const loansRef = collection(db, 'loans');
    const querySnapshot = await getDocs(loansRef);
    
    const loans = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const loan = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt?.seconds * 1000),
        approvedAt: data.approvedAt?.toDate ? data.approvedAt.toDate() : new Date(data.approvedAt?.seconds * 1000),
      };
      loan.balance = calculateLoanBalance(loan);
      loan.totalRepaid = getTotalRepaid(loan);
      loan.totalInterest = getTotalInterest(loan);
      return loan;
    });
    
    return loans.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error fetching all loans:", error);
    return [];
  }
}

export async function approveLoan(loanId) {
  try {
    const loanRef = doc(db, 'loans', loanId);
    await updateDoc(loanRef, {
      status: 'active',
      approvedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error approving loan:", error);
    throw error;
  }
}

export async function rejectLoan(loanId) {
  try {
    const loanRef = doc(db, 'loans', loanId);
    await updateDoc(loanRef, {
      status: 'rejected'
    });
    return true;
  } catch (error) {
    console.error("Error rejecting loan:", error);
    throw error;
  }
}

export async function repayLoan(loanId, amount) {
  try {
    const loanRef = doc(db, 'loans', loanId);
    
    // Add repayment with client-side timestamp
    await updateDoc(loanRef, {
      repayments: arrayUnion({
        amount,
        date: new Date()
      })
    });
    
    // Check if loan is fully paid
    const loanSnap = await getDoc(loanRef);
    const loanData = loanSnap.data();
    const balance = calculateLoanBalance({
      ...loanData,
      approvedAt: loanData.approvedAt || new Date()
    });
    
    if (balance <= 0) {
      await updateDoc(loanRef, {
        status: 'completed',
        completedAt: serverTimestamp()
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error repaying loan:", error);
    throw error;
  }
}