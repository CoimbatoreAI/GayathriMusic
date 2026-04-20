import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../lib/api';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'processing'>('processing');

  useEffect(() => {
    const processPayment = async () => {
      try {
        const token = searchParams.get('token');

        if (!token) {
          setPaymentStatus('failed');
          setIsProcessing(false);
          return;
        }

        // The payment should have been processed by the payment gateway
        // Let's check the payment status
        const response = await apiClient.getPaymentStatus(token);

        if (response.success) {
          setPaymentStatus('success');
        } else {
          setPaymentStatus('failed');
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        setPaymentStatus('failed');
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams]);

  const handleContinue = () => {
    navigate('/');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-purple-900 mb-2">Processing Payment</h2>
          <p className="text-purple-700">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-green-900 mb-4">Payment Successful!</h2>
          <p className="text-green-700 mb-6">
            🎉 Welcome to Gayathri Carnatic Music! Your enrollment has been confirmed.
          </p>
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-green-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• WhatsApp notification with class details</li>
              <li>• Access to course materials will be provided</li>
              <li>• Your first class will be scheduled soon</li>
            </ul>
          </div>
          <button
            onClick={handleContinue}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Continue to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">❌</span>
        </div>
        <h2 className="text-3xl font-bold text-red-900 mb-4">Payment Failed</h2>
        <p className="text-red-700 mb-6">
          Unfortunately, your payment could not be processed. Please try again or contact support.
        </p>
        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-red-900 mb-2">What can you do?</h3>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Try making the payment again</li>
            <li>• Check your payment method details</li>
            <li>• Contact support if the issue persists</li>
          </ul>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/enrollment')}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
          <button
            onClick={handleContinue}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}