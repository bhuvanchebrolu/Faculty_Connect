import React from "react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* NIT Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-600 rounded-md flex items-center justify-center shadow-md">
              <span className="text-white font-black text-xl tracking-tight">
                NIT
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                National Institute of Technology
              </h1>
              <p className="text-sm text-gray-600">Tiruchirappalli</p>
            </div>
          </div>

          {/* Portal Badge */}
          <div className="flex items-center gap-3 bg-gray-700 px-5 py-2.5 rounded-md shadow-sm">
            <div className="bg-yellow-600 rounded-md px-3 py-2 flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none">
                SCIENT
              </span>
            </div>

            <div>
              <p className="text-white font-semibold text-sm leading-tight">
                Internship Portal
              </p>
              <p className="text-gray-300 text-xs">Internal System Access</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
