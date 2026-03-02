import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Calendar, CheckCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { baseEvents } from '../components/EventComponents/eventsData';

const EventRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const eventData = location.state as { eventTitle: string; eventId: string } | null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+256',
    phoneNumber: '',
    companyName: '',
    attendanceMode: 'Physical',
    sessions: '',
    accessibilityRequests: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    agreeToTerms: ''
  });

  // Redirect if no event data
  if (!eventData) {
    navigate('/events');
    return null;
  }

  // Find the full event details
  const event = baseEvents.find(e => e.id === eventData.eventId);

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      email: '',
      phoneNumber: '',
      agreeToTerms: ''
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return !newErrors.fullName && !newErrors.email && !newErrors.phoneNumber && !newErrors.agreeToTerms;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log(`Registering for Event ${eventData.eventId}:`, formData);
      setStep(2);
    }
  };

  const handleBackToEvents = () => {
    navigate('/events');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {step === 1 ? (
        <>
          {/* Hero Section - Full Width */}
          <section
            className="relative h-[500px] flex items-center justify-center overflow-hidden pt-[56px] sm:pt-[64px] mt-[-56px] sm:mt-[-64px] bg-cover bg-center"
            style={{ backgroundImage: `url(${event?.image || ''})` }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-[#171a1f]/50" />

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-center text-white px-4 fade-in-up">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 fade-in-up delay-200">
                {eventData.eventTitle}
              </h1>
              <p className="text-lg md:text-xl mb-6 fade-in-up delay-400">
                {event?.description || 'Join us for this exciting event'}
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base fade-in-up delay-600">
                <div className="flex items-center gap-2">
                  <MapPin size={20} />
                  <span className="font-medium">{event?.location || 'TBA'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <span className="font-medium">{event?.date || 'TBA'}</span>
                </div>
              </div>
            </div>

            {/* Animations */}
            <style>
              {`
                @keyframes fadeInUp {
                  0% {
                    opacity: 0;
                    transform: translateY(30px);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                .fade-in-up {
                  animation: fadeInUp 1s ease-out both;
                }

                .delay-200 {
                  animation-delay: 0.2s;
                }

                .delay-400 {
                  animation-delay: 0.4s;
                }

                .delay-600 {
                  animation-delay: 0.6s;
                }
              `}
            </style>
          </section>

          {/* Form Section */}
          <main className="flex-1 py-12" style={{ backgroundColor: '#d0c9ea' }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Back Button */}
              <button
                onClick={handleBackToEvents}
                className="flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Events
              </button>

              {/* Registration Card */}
              <div className="bg-white rounded-lg shadow-md border border-purple-300 overflow-hidden">

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                  <div className="space-y-5">
                    {/* Full Name and Email - Side by Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                          Full name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          required
                          placeholder="Enter your Full name"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm ${
                            errors.fullName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={formData.fullName}
                          onChange={(e) => {
                            setFormData({...formData, fullName: e.target.value});
                            setErrors({...errors, fullName: ''});
                          }}
                        />
                        {errors.fullName && (
                          <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          placeholder="Enter your email address"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({...formData, email: e.target.value});
                            setErrors({...errors, email: ''});
                          }}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone Number and Company Name - Side by Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                          Phone number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={formData.countryCode}
                            onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                            className="w-24 px-2 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm"
                          >
                            <option value="+256">+256</option>
                            <option value="+254">+254</option>
                            <option value="+255">+255</option>
                            <option value="+250">+250</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                            <option value="+91">+91</option>
                            <option value="+234">+234</option>
                            <option value="+27">+27</option>
                          </select>
                          <input
                            id="phoneNumber"
                            type="tel"
                            required
                            placeholder="Enter your Phone number"
                            className={`flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm ${
                              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
                            value={formData.phoneNumber}
                            onChange={(e) => {
                              setFormData({...formData, phoneNumber: e.target.value});
                              setErrors({...errors, phoneNumber: ''});
                            }}
                          />
                        </div>
                        {errors.phoneNumber && (
                          <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                          Company name
                        </label>
                        <input
                          id="companyName"
                          type="text"
                          placeholder="Enter your company name"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm"
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Attendance Mode and Sessions - Side by Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="attendanceMode" className="block text-sm font-medium text-gray-700">
                          Attendee Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="attendanceMode"
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm bg-white"
                          value={formData.attendanceMode}
                          onChange={(e) => setFormData({...formData, attendanceMode: e.target.value})}
                        >
                          <option value="">Select your category</option>
                          <option value="Physical">Physical Attendance</option>
                          <option value="Virtual">Virtual Attendance</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="sessions" className="block text-sm font-medium text-gray-700">
                          Sessions <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="sessions"
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm bg-white"
                          value={formData.sessions}
                          onChange={(e) => setFormData({...formData, sessions: e.target.value})}
                        >
                          <option value="">Select your preferred session</option>
                          <option value="Morning">Morning Session</option>
                          <option value="Afternoon">Afternoon Session</option>
                          <option value="Full Day">Full Day</option>
                        </select>
                      </div>
                    </div>

                    {/* Accessibility Requests - Full Width */}
                    <div className="space-y-1">
                      <label htmlFor="accessibilityRequests" className="block text-sm font-medium text-gray-700">
                        Accessibility requests <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="accessibilityRequests"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm bg-white"
                        value={formData.accessibilityRequests}
                        onChange={(e) => setFormData({...formData, accessibilityRequests: e.target.value})}
                      >
                        <option value="">Select your answer</option>
                        <option value="None">No special requirements</option>
                        <option value="Wheelchair">Wheelchair access</option>
                        <option value="Hearing">Hearing assistance</option>
                        <option value="Visual">Visual assistance</option>
                        <option value="Other">Other requirements</option>
                      </select>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="pt-2">
                      {errors.agreeToTerms && (
                        <p className="text-xs text-red-500 mb-2">Please review your registration details before submitting.</p>
                      )}
                      <div className="flex items-start gap-2">
                        <input
                          id="agreeToTerms"
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={(e) => {
                            setFormData({...formData, agreeToTerms: e.target.checked});
                            setErrors({...errors, agreeToTerms: ''});
                          }}
                          className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                          I agree to the event{' '}
                          <a href="#" className="text-purple-600 underline hover:text-purple-700">
                            terms and conditions
                          </a>
                          {' '}and{' '}
                          <a href="#" className="text-purple-600 underline hover:text-purple-700">
                            privacy policy
                          </a>
                          .
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 active:bg-purple-800 transition-colors mt-6"
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </>
      ) : (
        /* Success State */
        <main className="flex-1 py-12 pt-24" style={{ backgroundColor: '#d0c9ea' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md border border-purple-300 p-12 text-center">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
              <div className="space-y-3 mb-8">
                <p className="text-gray-600 text-lg">
                  Hello <span className="font-semibold text-gray-900">{formData.fullName}</span>, 
                  you are successfully registered for:
                </p>
                <p className="text-xl font-bold text-purple-600 px-4">
                  {eventData.eventTitle}
                </p>
                <p className="text-gray-500 pt-4">
                  A confirmation for your <span className="font-semibold">{formData.attendanceMode}</span> attendance 
                  has been sent to <span className="font-semibold">{formData.email}</span>.
                </p>
              </div>
              <button
                onClick={handleBackToEvents}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Back to Events
              </button>
            </div>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
};

export default EventRegistrationPage;
