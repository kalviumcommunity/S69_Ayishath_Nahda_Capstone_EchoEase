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
        if (!token) return navigate("/login");

        const res = await axios.get("http://localhost:5000/api/therapist/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { name, designation, hospital, profilePic } = res.data;
        setTherapist({ name: name || "", designation: designation || "", hospital: hospital || "", profilePic: profilePic || "" });

        if (profilePic) {
          const imageUrl = profilePic.startsWith("http")
            ? profilePic
            : `${import.meta.env.VITE_META_URI}${profilePic}`;
          setPreviewUrl(imageUrl);
        } else {
          setPreviewUrl("");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setMessage("Error fetching profile");
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
    if (!file) return;

    if (!file.type.match("image.*")) {
      setMessage("Please select a valid image file (JPEG/PNG).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("File size must be under 2MB.");
      return;
    }

    setNewProfilePic(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMessage("");
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const formData = new FormData();
      formData.append("name", therapist.name);
      formData.append("designation", therapist.designation);
      formData.append("hospital", therapist.hospital);
      if (newProfilePic) formData.append("profilePic", newProfilePic);

      const res = await axios.put(
        "http://localhost:5000/api/therapist/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updated = res.data.therapist;
      setTherapist((prev) => ({ ...prev, ...updated, profilePic: updated.profilePic || prev.profilePic }));

      if (updated.profilePic) {
        const imageUrl = updated.profilePic.startsWith("http")
          ? updated.profilePic
          : `http://localhost:5000${updated.profilePic}`;
        setPreviewUrl(imageUrl);
      } else {
        setPreviewUrl("");
      }

      setEditing(false);
      window.dispatchEvent(new Event("profileUpdate"));
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Update failed:", error);
      setMessage(
        `Failed to update profile: ${error.response?.data?.message || error.message}`
      );
    }
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <img
          src="/image 22.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#365B6D] opacity-60" />
      </div>

      <main className="relative z-10 flex items-center justify-center h-full px-6">
        <div className="bg-[#B2D1CF]/50 p-6 rounded-2xl shadow-lg w-full max-w-md text-center text-black">
          {message && (
            <div
              className={`mb-4 p-2 rounded ${
                message.toLowerCase().includes("success")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = "/user.png"; // Fallback to default image
                  }}
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

          {/* Profile Fields */}
          {["name", "designation", "hospital"].map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-sm font-medium mb-1 capitalize">
                {field}
              </label>
              {editing ? (
                <input
                  type="text"
                  value={therapist[field]}
                  onChange={(e) =>
                    setTherapist({ ...therapist, [field]: e.target.value })
                  }
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#365B6D]"
                />
              ) : (
                <p className="p-2 rounded bg-[#B2D1CF]/70 inline-block">
                  {therapist[field] || "Not provided"}
                </p>
              )}
            </div>
          ))}

          {/* Action Buttons */}
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