import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "./Navbar";

const Profile = () => {
  const [therapist, setTherapist] = useState({
    name: "",
    designation: "",
    hospital: "",
    profilePic: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTherapistProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_META_URI}/api/therapist/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profileData = {
          name: res.data.name || "",
          designation: res.data.designation || "",
          hospital: res.data.hospital || "",
          profilePic: res.data.profilePic || "",
        };

        setTherapist(profileData);
        if (res.data.profilePic) {
          // Ensure the URL is absolute if it's not already
          const imageUrl = res.data.profilePic.startsWith('http') 
            ? res.data.profilePic 
            : `${import.meta.env.VITE_META_URI}${res.data.profilePic}`;
          setPreviewUrl(imageUrl);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistProfile();
  }, [navigate]);

  const handleEditToggle = () => {
    setEditing(!editing);
    setMessage("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setMessage("Please select an image file (JPEG, PNG)");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setMessage("File size must be less than 2MB");
        return;
      }
      
      setNewProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage("");
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const formData = new FormData();
      formData.append("name", therapist.name);
      formData.append("designation", therapist.designation);
      formData.append("hospital", therapist.hospital);
      
      if (newProfilePic) {
        formData.append("profilePic", newProfilePic);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_META_URI}/api/therapist/profile`, 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the therapist data with the response
      const updatedTherapist = {
        ...therapist,
        ...res.data.therapist
      };

      setTherapist(updatedTherapist);
      
      // Update the preview URL with the new image
      if (res.data.therapist.profilePic) {
        const imageUrl = res.data.therapist.profilePic.startsWith('http') 
          ? res.data.therapist.profilePic 
          : `${import.meta.env.VITE_META_URI}${res.data.therapist.profilePic}`;
        setPreviewUrl(imageUrl);
      }

      setEditing(false);
      window.dispatchEvent(new Event('profileUpdate'));
   
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Update failed:", error);
      setMessage(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Navbar />

      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/image 22.png"
          alt="Profile background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#365B6D] opacity-60"></div>
      </div>

      {/* Main content */}
      <main className="relative z-10 flex items-center justify-center h-full px-6">
        <div className="bg-[#B2D1CF]/50 p-6 rounded-2xl shadow-lg w-full max-w-md text-center text-black">
          {/* Message display */}
          {message && (
            <div className={`mb-4 p-2 rounded ${
              message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {message}
            </div>
          )}

          {/* Profile picture section */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden relative">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full" 
                  onError={() => setPreviewUrl("")} // Fallback if image fails to load
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
            
            {editing && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Change Profile Picture
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#365B6D] file:text-white
                    hover:file:bg-[#2a4758]"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {/* Profile fieldslists */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              {editing ? (
                <input
                  type="text"
                  value={therapist.name}
                  onChange={(e) => setTherapist({...therapist, name: e.target.value})}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#365B6D]"
                />
              ) : (
                <p className="p-2 rounded bg-[#B2D1CF]/70 inline-block">{therapist.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Designation</label>
              {editing ? (
                <input
                  type="text"
                  value={therapist.designation}
                  onChange={(e) => setTherapist({...therapist, designation: e.target.value})}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#365B6D]"
                />
              ) : (
                <p className="p-2 rounded bg-[#B2D1CF]/70 inline-block">{therapist.designation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hospital</label>
              {editing ? (
                <input
                  type="text"
                  value={therapist.hospital}
                  onChange={(e) => setTherapist({...therapist, hospital: e.target.value})}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#365B6D]"
                />
              ) : (
                <p className="p-2 rounded bg-[#B2D1CF]/70 inline-block">{therapist.hospital}</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6">
            {editing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="w-full py-2 bg-[#365B6D] text-white font-semibold rounded hover:bg-opacity-80 transition"
                >
                  Save
                </button>
                <button
                  onClick={handleEditToggle}
                  className="w-full py-2 bg-gray-500 text-white font-semibold rounded hover:bg-opacity-80 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="w-full py-2 bg-[#365B6D] text-white font-semibold rounded hover:bg-opacity-80 transition"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
