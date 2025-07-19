// pages/LandingPage.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import PracticeContext from "../context/PracticeContext";
export default function LandingPage() {
  const {isAuthenticated} = useContext(PracticeContext);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "DSA Practice Hub";
  }, []);
  
  const managenavigate=()=>{
    if(isAuthenticated)
    {
      navigate("/dsa-practice")
    }else{
         navigate("/register")
    }
  }


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
      <Navbar/>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 relative overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-purple-700 mb-6"
        >
          Build Your Own DSA Practice List
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-base sm:text-lg text-gray-700 max-w-2xl"
        >
          Create personalized DSA problem sets and sublists. Focus your practice, track your progress, and master Data Structures and Algorithms more efficiently!
        </motion.p>

        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute top-10 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-purple-200 rounded-full opacity-40 blur-3xl"
        />
        <motion.div
          animate={{ y: ["-50%", "50%"] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 w-20 h-20 sm:w-24 sm:h-24 bg-yellow-300 rounded-full opacity-30 blur-2xl"
        />
       
        <motion.button
        onClick={managenavigate}
          whileHover={{ scale: 1.1 }}
          className="mt-10 bg-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-purple-700 transition text-sm sm:text-base"
        >
          Get Started Now
        </motion.button>
      </main>

      <Footer />
    </div>
  );
}
