import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FacultyAuth = () => {
  const navigate = useNavigate();
  const { login, sendOTP, verifyOTP } = useAuth();
  const { success, error } = useMessage();

  const [activeTab, setActiveTab] = useState('login');
  const [registerStep, setRegisterStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    designation: '',
  });

  const [otp, setOtp] = useState('');

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(loginData.email, loginData.password, 'professor');

    if (result.success) {
      success('Welcome back!', `Logged in as ${result.user.name}`);
      navigate('/professor/dashboard');
    } else {
      error('Login Failed', result.error);
    }

    setIsLoading(false);
  };

  /* ---------------- SEND OTP ---------------- */
  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      error('Validation Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);

    const result = await sendOTP({
      ...registerData,
      role: 'professor',
    });

    if (result.success) {
      success('OTP Sent!', 'Please check your email for the verification code');
      setRegisterStep(2);
    } else {
      error('Registration Failed', result.error);
    }

    setIsLoading(false);
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await verifyOTP(registerData.email, otp);

    if (result.success) {
      success(
        'Registration Successful!',
        `Welcome to Faculty Connect, ${result.user.name}!`
      );
      navigate('/professor/dashboard');
    } else {
      error('Verification Failed', result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group transition-colors"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Portal Selection</span>
          </Link>

          <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Faculty Portal</h2>
              <p className="text-yellow-50 text-sm">
                NIT Trichy Academic Internship System
              </p>
            </div>

            {/* TABS */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setRegisterStep(1);
                }}
                className={`flex-1 py-4 font-semibold ${
                  activeTab === 'login'
                    ? 'text-yellow-700 border-b-2 border-yellow-600 bg-yellow-50'
                    : 'text-gray-600'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setRegisterStep(1);
                }}
                className={`flex-1 py-4 font-semibold ${
                  activeTab === 'register'
                    ? 'text-yellow-700 border-b-2 border-yellow-600 bg-yellow-50'
                    : 'text-gray-600'
                }`}
              >
                Register
              </button>
            </div>

            <AnimatePresence mode="wait">
              {/* LOGIN FORM */}
              {activeTab === 'login' && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleLogin}
                  className="px-8 py-8 space-y-6"
                >
                  <input
                    type="email"
                    placeholder="Faculty Email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border rounded-lg"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border rounded-lg"
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-yellow-600 text-white py-3 rounded-lg"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </motion.form>
              )}

              {/* REGISTER STEP 1 */}
              {activeTab === 'register' && registerStep === 1 && (
                <motion.form
                  key="register-step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSendOTP}
                  className="px-8 py-8 space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border rounded-lg"
                  />

                  <input
                    type="email"
                    placeholder="Faculty Email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Department"
                    value={registerData.department}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, department: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Designation"
                    value={registerData.designation}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, designation: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border rounded-lg"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, password: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border rounded-lg"
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, confirmPassword: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border rounded-lg"
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-yellow-600 text-white py-3 rounded-lg"
                  >
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </motion.form>
              )}

              {/* REGISTER STEP 2 (OTP) */}
              {activeTab === 'register' && registerStep === 2 && (
                <motion.form
                  key="register-step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleVerifyOTP}
                  className="px-8 py-8 space-y-6"
                >
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full px-4 py-3 border rounded-lg text-center tracking-widest"
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-yellow-600 text-white py-3 rounded-lg"
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Register'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default FacultyAuth;
