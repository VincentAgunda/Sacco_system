import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePayment } from '../../context/PaymentContext';
import { savePaymentToFirestore } from '../../services/payments';
import { initializePayment } from '../../services/paystack';
import { toast } from 'react-hot-toast';

export default function PaymentForm() {
  const [amount, setAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const { currentUser } = useAuth();
  const { addPayment } = usePayment();

  // Check if Paystack script is loaded
  useEffect(() => {
    if (window.PaystackPop) {
      setPaystackLoaded(true);
      return;
    }

    // Set up interval to check for script loading
    const intervalId = setInterval(() => {
      if (window.PaystackPop) {
        setPaystackLoaded(true);
        clearInterval(intervalId);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paystackLoaded) {
      toast.error('Payment gateway is still initializing. Please try again.');
      return;
    }
    
    if (!currentUser) {
      toast.error('Please log in to make payments');
      return;
    }
    
    if (amount < 1000) {
      toast.error('Minimum payment is ksh 1000');
      return;
    }
    
    if (!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
      toast.error('Payment gateway configuration error');
      return;
    }
    
    setProcessing(true);
    
    try {
      const paymentConfig = {
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: currentUser.email,
        amount: amount * 100, // Convert to cents
        currency: 'KES', // Kenyan Shillings
        metadata: {
          userId: currentUser.uid,
          userName: currentUser.displayName || 'Member'
        }
      };

      const response = await initializePayment(paymentConfig);
      
      if (response.status === 'success') {
        // Save payment to Firestore
        const paymentId = await savePaymentToFirestore({
          userId: currentUser.uid,
          userEmail: currentUser.email,
          userName: currentUser.displayName || 'Member',
          amount,
          status: 'completed',
          reference: response.reference,
          gateway: 'Paystack'
        });
        
        // Add to local state
        addPayment({
          id: paymentId,
          amount,
          date: new Date(),
          status: 'completed'
        });
        
        toast.success(`Payment of ksh ${amount} successful!`);
      } else {
        toast.error('Payment was not successful');
      }
    } catch (error) {
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
      <h2 className="text-xl font-semibold text-gold-accent mb-4">Make Payment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Amount (ksh)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            min="1000"
            step="100"
            placeholder="Min amount: 1000"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-accent"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={processing}
          className="w-full bg-gold-accent hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50"
        >
          {processing ? 'Processing Payment...' : `Pay ksh ${amount.toLocaleString()}`}
        </button>
        
        <div className="text-center text-gray-400 text-sm">
          <p>You'll be redirected to Paystack for secure payment processing</p>
          <p className="mt-1">Minimum payment: ksh 1000</p>
        </div>
      </form>
    </div>
  );
}