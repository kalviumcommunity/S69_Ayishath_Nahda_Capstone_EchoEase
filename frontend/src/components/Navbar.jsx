import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

export const Navbar = () => {
  const [profilePic, setProfilePic] = useState("/user.png");
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/therapist/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.profilePic) {
          const imgUrl = res.data.profilePic.startsWith("http")
            ? res.data.profilePic
            : `${import.meta.env.VITE_META_URI}${res.data.profilePic}`;
          setProfilePic(imgUrl);
        } else {
          setProfilePic("/user.png");
        }
      } catch (err) {
        console.error("Error fetching profile image:", err);
        setProfilePic("/user.png");
      }
    };

    fetchProfile(); // Fetch on mount

    // Listen for profile updates
    const handleProfileUpdate = () => fetchProfile();
    window.addEventListener("profileUpdate", handleProfileUpdate);

    return () => window.removeEventListener("profileUpdate", handleProfileUpdate);
  }, [location]);

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
        <div className="flex-grow"></div>
        <div className="relative z-50">
          {location.pathname === "/profile" ? (
            <Link to="/dashboard">
              <img
                src="/home.png"
                alt="Home"
                className="h-[35px] w-[35px] object-contain hover:opacity-80 cursor-pointer"
              />
            </Link>
          ) : (
            <Link to="/profile">
              <img
                src={profilePic}
                className="object-cover h-[50px] w-[50px] max-sm:w-10 max-sm:h-10 rounded-full"
                alt="Profile"
                onError={(e) => {
                  e.target.src = "/user.png";
                }}
              />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};