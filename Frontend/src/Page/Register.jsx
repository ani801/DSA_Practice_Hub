import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Url } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Generate username internally
function generateUsername(name) {
  const clean = name.replace(/[^a-zA-Z]/g, "").toLowerCase() || "user";
  const letters = clean.substring(0, Math.min(4, clean.length));
  const numbers = Math.floor(Math.random() * 10000).toString().padStart(3, "0");
  return `${letters}${numbers}`;
}

// ✅ Check username availability
async function checkUsernameAvailable(username) {
  try {
    const res = await axios.get(`${Url}/api/user/check-username/${username}`);
    return !res.data.exists;
  } catch (err) {
    console.error("Username check failed", err);
    return false;
  }
}

export default function Register() {
  useEffect(() => {
    document.title = "Register | DSA Practice Hub";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // ✅ Generate and assign username internally when name changes
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "name" && value.trim() !== "") {
      let candidate, isAvailable = false, attempts = 0;
      while (!isAvailable && attempts < 10) {
        candidate = generateUsername(value);
        isAvailable = await checkUsernameAvailable(candidate);
        attempts++;
      }
      setFormData((prev) => ({ ...prev, username: candidate }));
    }
  };

  // ✅ Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, username, email, password, confirmPassword } = formData;

    if (!name || !username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await axios.post(`${Url}/api/user/register`, {
        name,
        username, // ✅ sent silently
        email,
        password,
      });

      toast.success("Registration successful! Please log in to continue.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
          DSA Practice Hub
        </h1>

        <form className="space-y-4" onSubmit={handleRegister}>
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
