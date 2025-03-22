import React from "react";
import { Link } from "react-router-dom";

const EntryPoint = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F2F1EC]">
      {/* Left Side - Image Section */}
      <div className="relative w-3/5 h-screen">
        <img
          src="/bg.jpeg"
          className="w-full h-full object-cover filter grayscale brightness-90"
          alt="Children"
        />
        <div className="absolute top-14 left-40 text-white text-[24px] italic font-light w-[70%] font-['Abhaya_Libre'] animate-fadeIn duration-700 ease-in-out">
          A centralized platform for Speech Therapists & Audiologists
        </div>
      </div>

      {/* Right Side - Login & Signup Section */}
      <div className="w-2/5 h-screen flex flex-col items-center justify-center bg-[#F2F1EC] relative">
        {/* Logo */}
        <img src="/logo.png" alt="EchoEase Logo" className="w-95 mb-6 animate-fadeIn duration-700 ease-in-out" />
        {/* Rights Reserved Text (Placed under logo) */}
       <p className="text-gray-600 text-sm mt-3">© 2025 EchoEase. All rights reserved.</p>


        {/* Login & Signup Buttons Box */}
        <div className="bg-[#FFFFFF] p-6 rounded-lg shadow-xl w-72 text-center mt-[-50px] animate-fadeIn duration-700 ease-in-out">
          <Link to="/login">
            <button className="w-full bg-[#2D5B64] text-white py-3 rounded-md mb-6 flex items-center justify-center transition-all hover:bg-[#1E3C45] hover:scale-105">
              Login <span className="ml-2">➤</span>
            </button>
          </Link>

          <Link to="/signup">
            <button className="w-full bg-[#2D5B64] text-white py-3 rounded-md flex items-center justify-center transition-all hover:bg-[#1E3C45] hover:scale-105">
              Sign-Up <span className="ml-2">➤</span>
            </button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-gray-500 text-xs absolute bottom-6">
          © 2025 EchoEase. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default EntryPoint;
