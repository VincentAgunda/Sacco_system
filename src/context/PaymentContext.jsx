import { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export function usePayment() {
  return useContext(PaymentContext);
}

export function PaymentProvider({ children }) {
  const [paymentHistory, setPaymentHistory] = useState([]);

  const addPayment = (payment) => {
    setPaymentHistory(prev => [...prev, payment]);
  };

  return (
    <PaymentContext.Provider value={{ paymentHistory, addPayment }}>
      {children}
    </PaymentContext.Provider>
  );
}