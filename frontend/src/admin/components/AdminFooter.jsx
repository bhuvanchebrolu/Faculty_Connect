import React from 'react';
import { Link } from 'react-router-dom';

const AdminFooter = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto border-t-4 border-yellow-500">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* NIT Trichy Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-400">NIT Trichy</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              National Institute of Technology
              <br />
              Tiruchirappalli - 620 015
              <br />
              Tamil Nadu, India
            </p>
          </div>

          {/* SCIENT Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-400">SCIENT</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-2">
              Student Center for Innovation in Engineering and Technology
            </p>
            <p className="text-gray-400 text-xs">
              Connecting students with research opportunities
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.nitt.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-yellow-400 text-sm transition-colors"
                >
                  NITT Main Website
                </a>
              </li>
              <li>
                <a
                  href="https://www.nitt.edu/home/academics/calendar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-yellow-400 text-sm transition-colors"
                >
                  Academic Calendar
                </a>
              </li>
              <li>
                <a
                  href="https://webmail.nitt.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-yellow-400 text-sm transition-colors"
                >
                  Webmail
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-300 text-sm">
            © 2026 SCIEnT, All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-1.5">
            Internal Portal - Academic Use Only
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;