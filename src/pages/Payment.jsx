import React from 'react';
import PaymentForm from '../components/dashboard/PaymentForm';

export default function Payment() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-gold-accent mb-2">Make a Payment</h1>
        <p className="text-gray-400">Securely contribute to your savings or pay back loans</p>
      </div>
      
      <PaymentForm />
    </div>
  );
}