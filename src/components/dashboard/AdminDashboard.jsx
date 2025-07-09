import React, { useEffect, useState } from 'react';
import { getUsers, getAllPayments } from '../../services/payments';
import { getAllLoans } from '../../services/loans'; // Corrected import
import MembersTable from './MembersTable';
import PaymentHistory from '../ui/PaymentHistory';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPayments: 0,
    totalAmount: 0,
    pendingLoans: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, payments, loans] = await Promise.all([
          getUsers(),
          getAllPayments(),
          getAllLoans() // Now correctly imported from loans.js
        ]);
        
        const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const pendingLoans = loans.filter(loan => loan.status === 'pending').length;
        
        setStats({
          totalUsers: users.length,
          totalPayments: payments.length,
          totalAmount,
          pendingLoans
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
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
        <h1 className="text-2xl font-bold text-gold-accent">Admin Dashboard</h1>
        <Link 
          to="/dashboard/admin/loans" 
          className="bg-gold-accent hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg text-sm"
        >
          Manage Loans
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm mb-1">Total Members</h3>
          <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm mb-1">Total Payments</h3>
          <p className="text-3xl font-bold text-white">{stats.totalPayments}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm mb-1">Total Amount</h3>
          <p className="text-3xl font-bold text-white">ksh{stats.totalAmount.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm mb-1">Pending Loans</h3>
          <p className="text-3xl font-bold text-white">{stats.pendingLoans}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MembersTable />
        <PaymentHistory adminView />
      </div>
    </div>
  );
}