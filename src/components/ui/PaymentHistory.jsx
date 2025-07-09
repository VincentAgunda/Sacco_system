import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserPayments, getAllPayments } from '../../services/payments';
import { toast } from 'react-hot-toast';

export default function PaymentHistory({ adminView = false }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        let paymentsData = [];
        if (adminView) {
          paymentsData = await getAllPayments();
        } else if (currentUser) {
          paymentsData = await getUserPayments(currentUser.uid);
        }
        setPayments(paymentsData);
      } catch (error) {
        toast.error('Failed to load payments');
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [currentUser, adminView]);

  if (loading) return (
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
  );

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
      <h2 className="text-xl font-semibold text-gold-accent mb-4">
        {adminView ? 'All Payments' : 'Your Payment History'}
      </h2>
      
      {payments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No payments found</p>
          {!adminView && (
            <p className="text-gold-accent">
              Make your first payment to see it here
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                {adminView && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Member</th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {payments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-750">
                  {adminView && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {payment.userName} ({payment.userEmail})
                    </td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {payment.date?.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    ksh{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-green-100">
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-xs">
                    {payment.reference || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}