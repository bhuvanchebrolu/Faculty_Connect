import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { apiRequest } = useAuth();
  const { success, error: showError } = useMessage();

  // Determine role from URL path
  const getRole = () => {
    if (location.pathname.includes('student')) return 'student';
    if (location.pathname.includes('professor')) return 'professor';
    if (location.pathname.includes('admin')) return 'admin';
    return 'student';
  };

  const role = getRole();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Step 1: Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Email validation based on role
    if (role === 'student' && !formData.email.endsWith('@nitt.edu')) {
      showError('Invalid Email', 'Student email must end with @nitt.edu');
      setIsSubmitting(false);
      return;
    }
    if ((role === 'professor' || role === 'admin') && !formData.email.endsWith('@nitt.edu')) {
      showError('Invalid Email', 'Email must end with @nitt.edu');
      setIsSubmitting(false);
      return;
    }

    const result = await apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.email,
        role: role
      }),
    });

    if (result.success) {
      success('OTP Sent!', `Verification code sent to ${formData.email}`);
      setStep(2);
    } else {
      showError('Error', result.error);
    }

    setIsSubmitting(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await apiRequest('/api/auth/verify-reset-otp', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.email,
        otp: formData.otp,
      }),
    });

    if (result.success) {
      success('OTP Verified!', 'You can now reset your password');
      setStep(3);
    } else {
      showError('Invalid OTP', result.error);
    }

    setIsSubmitting(false);
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      showError('Password Mismatch', 'Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.newPassword.length < 6) {
      showError('Weak Password', 'Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    const result = await apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      }),
    });

    if (result.success) {
      success('Password Reset!', 'Your password has been updated successfully');
      // Redirect to appropriate auth page
      setTimeout(() => {
        navigate(`/${role}/auth`);
      }, 2000);
    } else {
      showError('Reset Failed', result.error);
    }

    setIsSubmitting(false);
  };

  const getRoleName = () => {
    if (role === 'student') return 'Student';
    if (role === 'professor') return 'Faculty';
    if (role === 'admin') return 'Administrator';
    return 'Student';
  };

  const getBackUrl = () => {
    return `/${role}/auth`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <motion.div
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate(getBackUrl())}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Login
          </button>

          {/* Card */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-8 py-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white text-center">Reset Password</h2>
              <p className="text-yellow-100 text-center text-sm mt-2">{getRoleName()} Portal</p>
            </div>

            {/* Progress Steps */}
            <div className="px-8 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {/* Step 1 */}
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                    {step > 1 ? '✓' : '1'}
                  </div>
                  <span className="ml-2 text-xs font-medium text-gray-700">Email</span>
                </div>

                <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-yellow-600' : 'bg-gray-300'}`}></div>

                {/* Step 2 */}
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                    {step > 2 ? '✓' : '2'}
                  </div>
                  <span className="ml-2 text-xs font-medium text-gray-700">Verify</span>
                </div>

                <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-yellow-600' : 'bg-gray-300'}`}></div>

                {/* Step 3 */}
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                    3
                  </div>
                  <span className="ml-2 text-xs font-medium text-gray-700">Reset</span>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div className="px-8 py-8">
              {/* STEP 1: Enter Email */}
              {step === 1 && (
                <motion.form
                  onSubmit={handleSendOTP}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter Your Email</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      We'll send a verification code to your registered email address.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder={role === 'student' ? 'student@nitt.edu' : 'faculty@nitt.edu'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending OTP...
                      </span>
                    ) : (
                      'Send Verification Code'
                    )}
                  </button>
                </motion.form>
              )}

              {/* STEP 2: Verify OTP */}
              {step === 2 && (
                <motion.form
                  onSubmit={handleVerifyOTP}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify OTP</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Enter the 6-digit code sent to <span className="font-medium text-gray-900">{formData.email}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Verification Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      required
                      maxLength="6"
                      placeholder="Enter 6-digit code"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md text-center text-2xl tracking-widest focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify Code'}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setFormData(prev => ({ ...prev, otp: '' }));
                      }}
                      className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      Resend Code
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3: New Password */}
              {step === 3 && (
                <motion.form
                  onSubmit={handleResetPassword}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Password</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Choose a strong password for your account.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      required
                      minLength="6"
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      placeholder="Re-enter new password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                  </button>
                </motion.form>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              OTP valid for 10 minutes • Secure connection
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;