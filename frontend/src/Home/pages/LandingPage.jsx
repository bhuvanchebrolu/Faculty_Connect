import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {console.log("API URL:", import.meta.env.VITE_API_URL)}
      <main className="flex-grow">
        {/* Hero Section */}
        <motion.div
          className="bg-white py-16 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              {...fadeInUp}
            >
              Welcome to NIT Trichy Academic Internship Portal
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              This is an internal institute system for managing academic internships and research projects.
              <br />
              Please select your portal below to continue.
            </motion.p>
          </div>
        </motion.div>

        {/* Demo Mode Notice */}
        <motion.div
          className="max-w-6xl mx-auto px-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-base font-semibold text-blue-900 mb-1">Demo Mode</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  This is a demonstration of the portal system. Once selected, each portal operates independently with no ability
                  to switch roles. In production, users would be automatically authenticated to their respective portal based on
                  their institute credentials.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Portal Cards */}
        <motion.div
          className="max-w-6xl mx-auto px-6 py-12"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Student Portal Card */}
            <motion.div
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="p-10">
                {/* Icon */}
                <motion.div
                  className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                  </svg>
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                  Student Portal
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  Browse research projects, connect with faculty members, and submit your applications.
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start text-sm text-gray-700">
                    <span className="inline-block w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>Search and filter projects by department</span>
                  </li>
                  <li className="flex items-start text-sm text-gray-700">
                    <span className="inline-block w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>View professor profiles and available opportunities</span>
                  </li>
                  <li className="flex items-start text-sm text-gray-700">
                    <span className="inline-block w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>Submit applications with CV and statement of purpose</span>
                  </li>
                </ul>

                {/* Button */}
                <motion.button
                  onClick={() => navigate('/student/auth')}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Access Student Portal
                </motion.button>
              </div>
            </motion.div>

            {/* Faculty Portal Card */}
            <motion.div
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="p-10">
                {/* Icon */}
                <motion.div
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                  Faculty Portal
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  Create and manage research projects, review student applications, and track progress.
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start text-sm text-gray-700">
                    <span className="inline-block w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>Create and edit research project listings</span>
                  </li>
                  <li className="flex items-start text-sm text-gray-700">
                    <span className="inline-block w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>Review student applications and CVs</span>
                  </li>
                  <li className="flex items-start text-sm text-gray-700">
                    <span className="inline-block w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>Accept or reject applications with status tracking</span>
                  </li>
                </ul>

                {/* Button */}
                <motion.button
                  onClick={() => navigate('/professor/auth')}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Access Faculty Portal
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Note */}
        <motion.div
          className="max-w-6xl mx-auto px-6 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
            <p className="text-sm text-yellow-900 leading-relaxed">
              <span className="font-semibold">Note:</span> This is an internal NIT Trichy system. Access requires valid institute credentials.
              Once you select a portal, you will be authenticated based on your role (Student or Faculty). There is no role-switching capability.
            </p>
          </div>
        </motion.div>

        {/* ADMIN ACCESS SECTION - NEW */}
        <motion.div
          className="max-w-6xl mx-auto px-6 pb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500 font-medium">System Administration</span>
            </div>
          </div>

          {/* Admin Access Card */}
          <motion.div
            className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-lg overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Admin Icon */}
                  <div className="w-14 h-14 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      <path d="M7 9a2 2 0 11-4 0 2 2 0 014 0zM14 9a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Administrator Access</h3>
                    <p className="text-gray-300 text-sm">
                      Restricted to authorized system administrators only
                    </p>
                  </div>
                </div>

                {/* Admin Button */}
                <motion.button
                  onClick={() => navigate('/admin/auth')}
                  className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors shadow-md flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Admin Login</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;