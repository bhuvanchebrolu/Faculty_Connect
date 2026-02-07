import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* NIT Trichy Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">NIT Trichy</h3>
            <p className="text-gray-300 text-sm">
              National Institute of Technology
            </p>
            <p className="text-gray-300 text-sm">
              Tiruchirappalli - 620 015
            </p>
            <p className="text-gray-300 text-sm">
              Tamil Nadu, India
            </p>
          </div>

          {/* SCIENT Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">SCIENT</h3>
            <p className="text-gray-300 text-sm mb-1">
              Student Council for Innovation, Entrepreneurship and Technology
            </p>
            <p className="text-gray-300 text-sm">
              Connecting students with research opportunities
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.nitt.edu" className="text-gray-300 hover:text-white text-sm transition-colors">
                  NITT Main Website
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Academic Calendar
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Webmail
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2026 National Institute of Technology, Tiruchirappalli. All rights reserved.</p>
            <p className="mt-1">Internal Portal - Academic Use Only</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;