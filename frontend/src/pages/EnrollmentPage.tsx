import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Music, DollarSign, X } from 'lucide-react';
import { apiClient } from '../lib/api';

interface EnrollmentForm {
  studentName: string;
  studentAge: number;
  contactNumber: string;
  email: string;
  location: string;
  courseType: string;
  courseLevel: string;
  preferredLanguage: string;
  paymentMethod: string;
}

export default function EnrollmentPage() {
  const [step, setStep] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<{
    type: string;
    level: string;
    price: number;
    classes: number;
  } | null>(null);
  const [showLocationError, setShowLocationError] = useState(false);
  const [isLoadingRazorpay, setIsLoadingRazorpay] = useState(false);
  const [admissionStatus, setAdmissionStatus] = useState<any>(null);
  const [checkingAdmission, setCheckingAdmission] = useState(true);

  useEffect(() => {
    const checkAdmission = async () => {
      try {
        const response = await apiClient.getAdmissionStatus();
        if (response.success && response.data) {
          setAdmissionStatus(response.data);
        }
      } catch (error) {
        console.error('Error checking admission status:', error);
      } finally {
        setCheckingAdmission(false);
      }
    };
    checkAdmission();
  }, []);

  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const { register, watch, setValue } = useForm<EnrollmentForm>();

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const createRazorpayOrder = async (): Promise<{ orderId: string; amount: number; currency: string; key: string }> => {
    if (!selectedCourse) {
      throw new Error('No course selected');
    }

    try {
      setIsLoadingRazorpay(true);
      const formData = watch();

      // Process enrollment first
      const enrollmentResponse = await apiClient.processEnrollmentWithPayment({
        studentName: formData.studentName,
        studentAge: Number(formData.studentAge),
        contactNumber: formData.contactNumber,
        email: formData.email,
        location: formData.location,
        courseType: selectedCourse.type,
        courseLevel: selectedCourse.level,
        preferredLanguage: formData.preferredLanguage,
        selectedCourse: {
          price: selectedCourse.price
        }
      });

      if (!enrollmentResponse.success || !enrollmentResponse.data) {
        throw new Error(enrollmentResponse.error || 'Failed to process enrollment');
      }

      const enrollmentData = (enrollmentResponse.data as any).data || enrollmentResponse.data;

      // Create Razorpay order
      const orderData = {
        enrollmentId: enrollmentData.enrollmentId,
        studentId: enrollmentData.studentId,
        courseId: enrollmentData.courseId,
        amount: enrollmentData.amount,
        currency: 'INR',
        metadata: {
          studentName: formData.studentName,
          studentEmail: formData.email,
          contactNumber: formData.contactNumber,
          courseType: selectedCourse.type,
          courseLevel: selectedCourse.level
        }
      };

      const response = await apiClient.createRazorpayOrder(orderData);

      if (response.success && response.data) {
        const razorData = (response.data as any).data || response.data;
        return {
          orderId: razorData.orderId || razorData.id,
          amount: razorData.amount || enrollmentData.amount,
          currency: razorData.currency || 'INR',
          key: razorData.key || razorpayKeyId || ''
        };
      } else {
        throw new Error(response.error || 'Failed to create Razorpay order');
      }
    } finally {
      setIsLoadingRazorpay(false);
    }
  };

  const courseTypes = [
    {
      type: 'individual-online-indian',
      name: 'Individual Online (Indian Students)',
      courses: [
        { level: 'Basic Course', price: 6000, classes: 8 },
        { level: 'Intermediate Course', price: 6000, classes: 8 },
        { level: 'Post Intermediate Course', price: 7500, classes: 8 }
      ]
    },
    {
      type: 'group-online-indian',
      name: 'Group Online (Indian Students)',
      courses: [
        { level: 'Basic Course', price: 2500, classes: 8 },
        { level: 'Intermediate Course', price: 2500, classes: 8 },
        { level: 'Post Intermediate Course', price: 4000, classes: 8 }
      ]
    },
    {
      type: 'individual-online-foreign',
      name: 'Individual Online (Foreign Students)',
      courses: [
        { level: 'Basic Course', price: 8000, classes: 8 },
        { level: 'Intermediate Course', price: 8000, classes: 8 },
        { level: 'Post Intermediate Course', price: 9500, classes: 8 }
      ]
    },
    {
      type: 'individual-offline',
      name: 'Individual Offline (Chennai Only)',
      courses: [
        { level: 'Basic Course', price: 8000, classes: 8 },
        { level: 'Intermediate Course', price: 8000, classes: 8 },
        { level: 'Post Intermediate Course', price: 9500, classes: 8 }
      ]
    }
  ];

  const handleCourseSelection = (courseType: string, level: string, event: React.MouseEvent) => {
    event.preventDefault();
    const formValues = watch();

    const requiredFields: (keyof EnrollmentForm)[] = ['studentName', 'studentAge', 'contactNumber', 'email', 'location', 'preferredLanguage'];
    const missingFields = requiredFields.filter(field => !formValues[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields.`);
      return;
    }

    const course = courseTypes.find(ct => ct.type === courseType);
    const selectedLevel = course?.courses.find(c => c.level === level);

    if (courseType === 'individual-offline' && formValues.location?.toLowerCase() !== 'chennai') {
      setShowLocationError(true);
      return;
    }

    setShowLocationError(false);
    if (course && selectedLevel) {
      setSelectedCourse({
        type: course.name,
        level: level,
        price: selectedLevel.price,
        classes: selectedLevel.classes
      });
      setValue('courseType', courseType);
      setValue('courseLevel', level);
      setStep(2);
    }
  };

  if (checkingAdmission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (admissionStatus && !admissionStatus.isAdmissionOpen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Admissions Closed</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Thank you for your interest! Currently, we are not accepting new enrollments.
            Please check back later or contact us for more information.
          </p>
          <Link
            to="/contact"
            className="inline-block w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg"
          >
            Contact for Waitlist
          </Link>
          <Link
            to="/"
            className="block mt-4 text-purple-600 font-medium hover:underline"
          >
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">Enroll for Carnatic Music Classes</h1>
          <p className="text-xl text-purple-700">Begin your musical journey with Gayathri Carnatic Music</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s ? 'bg-purple-600 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-500'
                  }`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-16 h-1 mx-2 transition-all duration-500 ${step > s ? 'bg-purple-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
            <h2 className="text-2xl font-bold text-purple-900 mb-8 flex items-center">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-3 text-sm">1</span>
              Student Information
            </h2>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Student Name *</label>
                <input {...register('studentName', { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none transition-all" placeholder="Full Name" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Age *</label>
                <input type="number" {...register('studentAge', { required: true, min: 5 })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none transition-all" placeholder="Years" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Contact Number *</label>
                <input {...register('contactNumber', { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none transition-all" placeholder="+91..." />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Email Address *</label>
                <input type="email" {...register('email', { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none transition-all" placeholder="email@example.com" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Location *</label>
                <input {...register('location', { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none transition-all" placeholder="City, Country" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Preferred Language *</label>
                <select {...register('preferredLanguage', { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none transition-all">
                  <option value="">Select Language</option>
                  <option value="tamil">Tamil</option>
                  <option value="telugu">Telugu</option>
                  <option value="kannada">Kannada</option>
                  <option value="english">English</option>
                </select>
              </div>
            </form>

            <div className="mb-10 p-6 bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100 border-l-8 border-purple-600 rounded-xl shadow-md">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                    <span className="text-white text-xl font-bold">!</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-900 mb-2">PLEASE NOTE</h3>
                  <p className="text-purple-800 leading-relaxed font-semibold text-lg italic">
                    "Any new student that Gayathri Thulasi is unable to accommodate in her teaching schedule will be handled by her team of teachers. She will be tracking their progress and overseeing a part of one class per month."
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-purple-900 mb-8 flex items-center">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-3 text-sm">2</span>
              Choose Your Course
            </h2>

            <div className="space-y-8">
              {courseTypes.map((courseType) => (
                <div key={courseType.type} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-purple-200 transition-colors">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Music className="w-5 h-5 mr-2 text-purple-600" />
                    {courseType.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {courseType.courses.map((course) => (
                      <div key={course.level} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-gray-800 mb-2">{course.level}</h4>
                        <div className="text-2xl font-black text-purple-600 mb-2">₹{course.price.toLocaleString()}</div>
                        <div className="text-sm text-gray-500 font-medium mb-4">{course.classes} classes / month</div>
                        <button
                          onClick={(e) => handleCourseSelection(courseType.type, course.level, e)}
                          className="w-full py-2.5 bg-purple-50 text-purple-700 font-bold rounded-lg hover:bg-purple-600 hover:text-white transition-all transform hover:scale-[1.02]"
                        >
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {showLocationError && (
              <div className="mt-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg animate-shake">
                One-to-one offline classes are only available for Chennai-based students.
              </div>
            )}
          </div>
        )}

        {step === 2 && selectedCourse && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-purple-900 mb-8">Confirm Your Selection</h2>
            <div className="bg-purple-50 rounded-2xl p-8 mb-10 border border-purple-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">Course Type</p>
                    <p className="text-lg font-bold text-gray-900">{selectedCourse.type}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">Level</p>
                    <p className="text-lg font-bold text-gray-900">{selectedCourse.level}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-purple-200 pb-2">
                    <span className="text-gray-600 font-medium">Monthly Fee</span>
                    <span className="text-xl font-bold text-gray-900">₹{selectedCourse.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-purple-200 pb-2">
                    <span className="text-gray-600 font-medium">Registration Fee</span>
                    <span className="text-xl font-bold text-gray-900">₹250</span>
                  </div>
                  <div className="pt-4">
                    <div className="flex justify-between items-center text-2xl font-black text-purple-600">
                      <span>Total</span>
                      <span>₹{(selectedCourse.price + 250).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-all">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02]">Proceed to Payment</button>
            </div>
          </div>
        )}

        {step === 3 && selectedCourse && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100 animate-in fade-in slide-in-from-bottom-4">
            {isLoadingRazorpay && (
              <div className="fixed inset-0 bg-purple-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center space-y-6">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Music className="w-8 h-8 text-purple-600 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">YOU ARE ALMOST THERE…</h3>
                    <p className="text-gray-500 font-medium transition-opacity animate-pulse">Initializing secure payment...</p>
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold text-purple-900 mb-8">Secure Payment</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                    Payment Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Course Fee</span>
                      <span>₹{selectedCourse.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Registration</span>
                      <span>₹250</span>
                    </div>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <div className="flex justify-between text-xl font-black text-purple-600">
                      <span>Total Amount</span>
                      <span>₹{(selectedCourse.price + 250).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-all">Change Course</button>
              </div>

              <div className="flex flex-col justify-center items-center p-8 bg-purple-50 rounded-2xl border-2 border-dashed border-purple-200">
                <img src="/images/razorpay-logo.png" alt="Razorpay" className="h-8 mb-8 opacity-50 grayscale" onError={(e) => (e.currentTarget.style.display = 'none')} />
                <button
                  onClick={async () => {
                    try {
                      setIsLoadingRazorpay(true);
                      const orderData = await createRazorpayOrder();
                      const razorpayWindow = window as any;

                      const options = {
                        key: orderData.key,
                        amount: orderData.amount,
                        currency: orderData.currency,
                        order_id: orderData.orderId,
                        name: 'Gayathri Carnatic Music',
                        description: `${selectedCourse.type} Enrollment`,
                        image: '/images/logo.png',
                        handler: async (response: any) => {
                          try {
                            setIsLoadingRazorpay(true);
                            const verificationRes = await apiClient.verifyRazorpayPayment(response);
                            if (verificationRes.success) {
                              window.location.href = `/enrollment/payment/success?token=${response.razorpay_payment_id}`;
                            } else {
                              alert('Payment verification failed');
                            }
                          } finally {
                            setIsLoadingRazorpay(false);
                          }
                        },
                        modal: { ondismiss: () => setIsLoadingRazorpay(false) },
                        prefill: {
                          name: watch('studentName'),
                          email: watch('email'),
                          contact: watch('contactNumber')
                        },
                        theme: { color: '#7c3aed' }
                      };

                      if (!razorpayWindow.Razorpay) {
                        const script = document.createElement('script');
                        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                        script.onload = () => {
                          const rzp = new (window as any).Razorpay(options);
                          rzp.open();
                        };
                        document.head.appendChild(script);
                      } else {
                        const rzp = new razorpayWindow.Razorpay(options);
                        rzp.open();
                      }
                    } catch (err) {
                      console.error(err);
                      alert('Failed to start payment');
                      setIsLoadingRazorpay(false);
                    }
                  }}
                  className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white text-xl font-black rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-3"
                >
                  <DollarSign className="w-8 h-8" />
                  <span>PAY NOW</span>
                </button>
                <p className="mt-4 text-xs text-purple-400 font-bold tracking-widest uppercase">Secured by Razorpay</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}