import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error: showError } = useMessage();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate email format
    if (!formData.email.endsWith('@nitt.edu')) {
      showError('Invalid Email', 'Admin email must end with @nitt.edu');
      setIsSubmitting(false);
      return;
    }

    const result = await login(formData.email, formData.password , 'admin');
    console.log('Login result:', result); // Debugging statement to check login result
    if (result.success) {
      if (result.user.role === 'admin') {
        success('Login Successful', `Welcome, ${result.user.name}!`);
        navigate('/admin/dashboard');
      } else {
        showError('Access Denied', 'This portal is for administrators only');
        // Logout if not admin
        await login(formData.email, formData.password);
      }
    } else {
      showError('Login Failed', result.error);
    }

    setIsSubmitting(false);
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
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>

          {/* Card */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-8 py-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white text-center">Administrator Portal</h2>
              <p className="text-gray-300 text-center text-sm mt-2">System Administration Access</p>
            </div>

            {/* Warning Notice */}
            <div className="bg-red-50 border-b border-red-200 px-8 py-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-900">Restricted Access</p>
                  <p className="text-xs text-red-800 mt-1">
                    This portal is restricted to authorized administrators only. All login attempts are monitored and logged.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-8">
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Admin Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="admin@nitt.edu"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be a valid @nitt.edu email address</p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  onSubmit={handleSubmit}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    'Access Admin Portal'
                  )}
                </motion.button>
              </div>
            </form>

            {/* Footer Note */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                By logging in, you acknowledge that you are an authorized system administrator and agree to comply with all institutional policies.
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure connection established • All actions are logged
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminAuth;