import React from 'react';
import PaymentHistory from '../components/ui/PaymentHistory';

export default function PaymentHistoryPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-gold-accent mb-2">Payment History</h1>
        <p className="text-gray-400">View your transaction history</p>
      </div>
      
      <PaymentHistory />
    </div>
  );
}