import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { Url } from "../App";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaFacebook,
  FaXTwitter,
} from "react-icons/fa6";
import PracticeContext from "../context/PracticeContext";
import Navbar from "../Components/Navbar";

export default function ProfilePage() {
  const { user, setUser } = useContext(PracticeContext);
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState({});
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState({
    name: false,
    username: false,
    email: false,
    institution: false,
    linkedin: false,
    github: false,
    instagrm: false,
    facebook: false,
    x: false,
  });

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      console.log("user", user);
      toast.info("Please login to access your profile");
      const timeout = setTimeout(() => navigate("/"), 1000);
      return () => clearTimeout(timeout);
    } else {
      const defaultData = {
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        institution: user.institution || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        instagrm: user.instagrm || "",
        facebook: user.facebook || "",
        x: user.x || "",
      };
      setFormData(defaultData);
      setInitialData(defaultData);
    }
  }, [user, navigate]);

  const isChanged = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleSave = async () => {
    try {
      const response = await axios.put(`${Url}/api/user/update`, formData, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setEditMode({});
        setUser(response.data.user);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem(response.data.user.username, JSON.stringify(response.data.user));
        const updatedData = {
          name: response.data.user.name || "",
          username: response.data.user.username || "",
          email: response.data.user.email || "",
          institution: response.data.user.institution || "",
          linkedin: response.data.user.linkedin || "",
          github: response.data.user.github || "",
          instagrm: response.data.user.instagrm || "",
          facebook: response.data.user.facebook || "",
          x: response.data.user.x || "",
        };
        setInitialData(updatedData);
        setFormData(updatedData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const renderField = (Icon, key) => (
    <div className="mb-4">
      <label className="block text-sm text-gray-500 font-medium mb-1">
        <div className="flex items-center gap-2">
          <Icon className="text-lg text-purple-600" />
        </div>
      </label>
      <div className="flex items-center gap-2">
        {editMode[key] ? (
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData[key]}
            onChange={(e) =>
              setFormData({ ...formData, [key]: e.target.value })
            }
          />
        ) : (
          <span className="text-gray-700">
            {formData[key] || "Not Specified"}
          </span>
        )}
        <button
          onClick={() =>
            setEditMode((prev) => ({ ...prev, [key]: !prev[key] }))
          }
        >
          <FaEdit className="text-purple-600 hover:text-purple-800" />
        </button>
      </div>
    </div>
  );

  if (!user) {
    return null; // prevent rendering while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-12">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-8">
            <img
              className="w-28 h-28 rounded-full border-4 border-purple-500 shadow-md object-cover"
              src={user.pic || "https://i.pravatar.cc/150?img=13"}
              alt="Profile"
            />

            {/* Editable Name */}
            <div className="flex items-center gap-2 mt-4">
              {editMode.name ? (
                <input
                  type="text"
                  className="border border-gray-300 rounded-md px-3 py-1 text-gray-800 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">
                  {formData.name || "Anonymous"}
                </h2>
              )}
              <button
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, name: !prev.name }))
                }
              >
                <FaEdit className="text-purple-600 hover:text-purple-800" />
              </button>
            </div>

            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>

          {/* Editable Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField(() => <span>Username</span>, "username")}
            {renderField(() => <span>Email</span>, "email")}
            {renderField(() => <span>🏫 Institution</span>, "institution")}
          </div>

          {/* Stats */}
          <div className="mt-10 border-t pt-6 text-center grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div className="bg-purple-50 p-4 rounded-lg shadow">
              📌 <strong className="text-lg">{user.problems?.length || 0}</strong>
              <p className="mt-1">Problems Listed</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg shadow">
              🔥 <strong className="text-lg">{user.potdref?.length || 0}</strong>
              <p className="mt-1">POTD Solved Days</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg shadow">
              📅 <strong className="text-lg">{new Date(user.timeStamp).toDateString()}</strong>
              <p className="mt-1">Account Created</p>
            </div>
          </div>

          {/* Socials */}
          <div className="mt-10 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField(FaLinkedin, "linkedin")}
              {renderField(FaGithub, "github")}
              {renderField(FaInstagram, "instagrm")}
              {renderField(FaFacebook, "facebook")}
              {renderField(FaXTwitter, "x")}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSave}
              disabled={!isChanged}
              className={`${
                isChanged
                  ? "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white font-semibold px-8 py-3 rounded-full shadow-lg transition`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
