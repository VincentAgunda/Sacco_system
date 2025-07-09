import React from 'react';
import LoanRequestForm from '../components/loans/LoanRequestForm';

export default function LoanRequestPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-gold-accent mb-2">Request a Loan</h1>
        <p className="text-gray-400">Apply for a loan with competitive interest rates</p>
      </div>
      
      <LoanRequestForm />
    </div>
  );
}