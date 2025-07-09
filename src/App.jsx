import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PaymentProvider } from './context/PaymentContext';
import { LoanProvider } from './context/LoanContext';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import PaymentPage from './pages/Payment';
import PaymentHistoryPage from './pages/PaymentHistory';
import MembersTable from './components/dashboard/MembersTable';
import PaymentHistory from './components/ui/PaymentHistory';
import LoanRequestPage from './pages/LoanRequest';
import LoanManagementPage from './pages/LoanManagement';
import LoanRepaymentPage from './pages/LoanRepayment';

function App() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <LoanProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<UserDashboard />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="make-payment" element={<PaymentPage />} />
                <Route path="history" element={<PaymentHistoryPage />} />
                <Route path="request-loan" element={<LoanRequestPage />} />
                <Route path="admin/users" element={<MembersTable />} />
                <Route path="admin/payments" element={<PaymentHistory adminView />} />
                <Route path="admin/loans" element={<LoanManagementPage />} />
                <Route path="repay-loan/:loanId" element={<LoanRepaymentPage />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </LoanProvider>
      </PaymentProvider>
    </AuthProvider>
  );
}

export default App;