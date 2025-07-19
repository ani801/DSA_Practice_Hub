// components/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaSignInAlt, FaUserPlus, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useContext } from "react";
import PracticeContext from "../context/PracticeContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Url } from "../App";
import { useNavigate } from "react-router-dom";


export default function Navbar() {
  const navigate = useNavigate();
  // State to manage menu and dropdown visibility
  const{ setIsAuthenticated, username ,isAuthenticated} = useContext(PracticeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async() => {
    try {
     const response = await axios.get(`${Url}/api/user/logout`, { withCredentials: true });
     if (response.data.success) {
      setIsAuthenticated(false);
      setDropdownOpen(false);
      navigate("/");
      // Clear user data from localStorage
      localStorage.removeItem(localStorage.getItem("username"));
      localStorage.removeItem("username");
      toast.success("Logged out successfully!");
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
const handleProfileClick = () => {
  setDropdownOpen(false);
  navigate("/profile");
};


  return (
    <header className="flex flex-col md:flex-row md:justify-between md:items-center px-6 py-4 bg-white shadow-md">
      <div className="flex justify-between items-center w-full md:w-auto">
        <div className="text-2xl sm:text-3xl font-bold text-purple-600">DSA Practice Hub</div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-purple-600 text-xl"
        >
          <FaBars />
        </button>
      </div>

      <nav className={`flex flex-col md:flex-row md:space-x-6 mt-4 md:mt-0 text-gray-700 font-medium ${menuOpen ? 'block' : 'hidden'} md:flex`}>
        <Link to="/" className="hover:text-purple-600 px-2 py-1">Home</Link>
        <Link to="/importance" className="hover:text-purple-600 px-2 py-1">Importance</Link>
        <Link to="/dsa-practice" className="hover:text-purple-600 px-2 py-1">DSA</Link>
        {/* <a href="#development" className="hover:text-purple-600 px-2 py-1">Development</a> */}
        <a href="#core" className="hover:text-purple-600 px-2 py-1">Core Subjects</a>
      </nav>

      <div className="relative mt-4 md:mt-0 text-sm md:text-base">
        {!isAuthenticated ? (
          <div className="flex space-x-4 items-center">
            <Link to="/login" onClick={() => setIsAuthenticated(true)} className="flex items-center space-x-1 text-purple-600 hover:text-purple-800">
              <FaSignInAlt />
              <span>Login</span>
            </Link>
            <Link to="/register" onClick={() => setIsAuthenticated(true)} className="flex items-center space-x-1 text-purple-600 hover:text-purple-800">
              <FaUserPlus />
              <span>Register</span>
            </Link>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 text-purple-700 font-semibold"
            >
              <FaUserCircle size={22} />
              <span className="hidden sm:inline">{username}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button onClick={handleProfileClick} className="w-full text-left px-4 py-2 flex items-center space-x-2 text-gray-700 hover:bg-orange-100">
                  <FaUserCircle />
                  <span>{username}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 flex items-center space-x-2 text-red-500 hover:bg-orange-100"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
