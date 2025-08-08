import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Url } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import PracticeContext from "../context/PracticeContext";

export default function Login() {
  const { setIsAuthenticated, setUsername } = useContext(PracticeContext);

  useEffect(() => {
    document.title = "Login | DSA Practice Hub";
  }, []);

  const [data, setData] = useState({ uniqueId: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!data.uniqueId || !data.password) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      const response = await axios.post(`${Url}/api/user/login`, data, {
        withCredentials: true,
      });

      if (!response.data.success) {
        toast.error(response.data.message || "Login failed. Please try again.");
        navigate("/login");
        setIsAuthenticated(false);
        return;
      }

      const user = response.data.user;

      // Clear localStorage if different user logs in
      if (localStorage.getItem("username") !== user.username) {
        localStorage.clear();
      }

      localStorage.setItem(user.username, JSON.stringify(user));
      localStorage.setItem("username", user.username);

      toast.success("Login successful!");
      setIsAuthenticated(true);
      setUsername(user.username);

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        error.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
        {/* App Name */}
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
          DSA Practice Hub
        </h1>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-700 mb-1">Email or Username</label>
            <input
              type="text"
              name="uniqueId"
              value={data.uniqueId}
              onChange={handleChange}
              placeholder="Enter your email or username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            {/* Forgot Password Link */}
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-purple-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center text-sm text-gray-600 mt-4">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
