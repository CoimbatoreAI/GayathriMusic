import { useState, useEffect } from 'react';
import { Check, Globe, Users, Clock, Loader2, Info } from 'lucide-react';
import { apiClient } from '../lib/api';

interface FeeStructure {
  _id: string;
  name: string;
  description?: string;
  courseType: string;
  courseLevel: string;
  language: string;
  basePrice: number;
  registrationFee: number;
  finalPrice: number;
  isActive: boolean;
}

export default function FeesPage() {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await apiClient.getFeeStructures();
        if (response.success && Array.isArray(response.data)) {
          setFeeStructures(response.data.filter((f: FeeStructure) => f.isActive));
        }
      } catch (err) {
        console.error('Error fetching fees:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  const categories = [
    { id: 'Individual Online - Indian', title: 'Individual Classes (Online)', subtitle: 'For Students residing in India', icon: Users },
    { id: 'Group Online - Indian', title: 'Group Classes (Online)', subtitle: 'For Students residing in India', icon: Users },
    { id: 'Individual Online - Foreign', title: 'Individual Classes (Online)', subtitle: 'For Foreign Students', icon: Globe },
    { id: 'Individual Offline - Chennai', title: 'Individual Classes (Offline)', subtitle: 'Chennai Region Only', icon: Clock },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 text-9xl">🎼</div>
          <div className="absolute bottom-0 right-0 text-9xl">🎹</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6">Course Fee Structure</h1>
          <p className="text-xl max-w-3xl mx-auto text-purple-100">
            Transparent pricing for everyone. Choose the plan that best fits your musical journey.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat) => {
              const plans = feeStructures.filter(f => f.courseType === cat.id);
              if (plans.length === 0) return null;

              const Icon = cat.icon;

              return (
                <div key={cat.id} className="bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden hover:shadow-purple-200 transition-all duration-300">
                  <div className="p-8 bg-purple-50 border-b border-purple-100">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm mr-4">
                        <Icon className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{cat.title}</h2>
                        <p className="text-purple-600 font-medium">{cat.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="space-y-6">
                      {plans.map((plan) => (
                        <div key={plan._id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-purple-300 hover:bg-white transition-all duration-300">
                          <div>
                            <h3 className="font-bold text-gray-900">{plan.courseLevel}</h3>
                            <p className="text-sm text-gray-500">{plan.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-purple-600">
                              {plan.courseType.includes('Foreign') ? '$' : '₹'}{plan.finalPrice}
                            </div>
                            <div className="text-xs text-gray-400">per month</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">8 Classes per Month (2 classes per week)</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">Personalized attention & tracking</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">Study materials & recorded sessions</span>
                      </div>
                    </div>

                    <a
                      href="/enroll"
                      className="mt-8 block w-full text-center py-4 px-6 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-200"
                    >
                      Enroll Now
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-purple-100">
            <div className="flex items-center mb-8">
              <Info className="h-8 w-8 text-purple-600 mr-4" />
              <h2 className="text-3xl font-bold text-gray-900">Important Notes</h2>
            </div>
            <div className="space-y-6 text-gray-600">
              <div className="flex items-start bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <Check className="h-5 w-5 text-amber-500 mr-4 mt-1" />
                <p><strong>Registration Fee:</strong> A one-time registration fee may apply for new students as configured in the administrative settings.</p>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-purple-400 mr-4 mt-1" />
                <p>Fees are payable at the beginning of each month/cycle to ensure continued access to classes.</p>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-purple-400 mr-4 mt-1" />
                <p>For more detailed information or custom requirements, please contact our administrative team.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}