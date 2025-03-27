import React from "react";

export const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-[#D9D9D9] shadow-sm">
      <div className="flex justify-between items-center px-5 py-0 w-full h-[73px]">
        <div className="relative z-50">
          <img
            src="/logo.png"
            className="object-contain mt-0 h-[124px] w-[124px] max-sm:w-20 max-sm:h-20"
            alt="EchoEase Logo"
          />
        </div>
        <div className="relative z-50">
          <img
            src="/user.png"
            className="object-contain h-[50px] w-[50px] max-sm:w-10 max-sm:h-10 rounded-full"
            alt="Profile"
          />
        </div>
      </div>
    </nav>
  );
};