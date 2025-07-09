export const initializePayment = (config) => {
  // Check if Paystack is loaded
  if (!window.PaystackPop) {
    throw new Error("Paystack script not loaded");
  }
  
  return new Promise((resolve, reject) => {
    const handler = window.PaystackPop.setup({
      ...config,
      currency: 'KES', // Kenyan Shillings
      callback: (response) => {
        resolve(response);
      },
      onClose: () => {
        reject(new Error("Payment closed by user"));
      }
    });
    handler.openIframe();
  });
};