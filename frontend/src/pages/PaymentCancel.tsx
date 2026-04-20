import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function PaymentCancel() {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate('/enrollment');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
        <XCircle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-orange-900 mb-4">Payment Cancelled</h2>
        <p className="text-orange-700 mb-6">
          You have cancelled the payment process. No charges have been made to your account.
        </p>
        <div className="bg-orange-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-orange-900 mb-2">What would you like to do?</h3>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Return to enrollment and try again</li>
            <li>• Choose a different payment method</li>
            <li>• Contact us if you need assistance</li>
          </ul>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200"
          >
            Try Payment Again
          </button>
          <button
            onClick={handleBackToHome}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}