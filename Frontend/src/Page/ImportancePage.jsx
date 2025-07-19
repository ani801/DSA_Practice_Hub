import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar"; // Adjust path based on your folder structure


export default function ImportancePage() {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 font-sans text-gray-800">
      <Navbar/>
      {/* === Hero Section === */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700 mb-4">
          Welcome to CodeHub — Your CSE Companion 🚀
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Practice DSA, Master Core Subjects, and Build Real Projects – All in One Place.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/dsa-practice"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Start DSA Practice
          </Link>
          <Link
            to="#core-subjects"
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
          >
            Learn Core Subjects
          </Link>
          {/* <Link
            to="/development"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Explore Development
          </Link> */}
        </div>
      </section>

      {/* === Three Pillars Section === */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl text-center font-bold mb-12 text-gray-800">What You Can Learn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* DSA Practice */}
          <div className="bg-gradient-to-br from-purple-200 to-purple-100 rounded-lg p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-purple-800 mb-2">DSA Practice</h3>
            <p className="text-sm text-gray-700">
              Sharpen your problem-solving skills with handpicked problems. Track your streaks, attempt problems daily, and prepare for placements.
            </p>
            <ul className="mt-3 list-disc list-inside text-sm text-gray-600">
              <li>POTD (Problem of the Day)</li>
              <li>Topic-wise Practice</li>
              <li>Streak Tracker</li>
            </ul>
          </div>

          {/* Core Subjects */}
          <div className="bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-lg p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-yellow-800 mb-2">Core Subjects</h3>
            <p className="text-sm text-gray-700">
              Learn and revise core CSE subjects with structured notes and MCQs.
            </p>
            <ul className="mt-3 list-disc list-inside text-sm text-gray-600">
              <li>Operating Systems</li>
              <li>DBMS</li>
              <li>Computer Networks</li>
              <li>OOPs & Compiler Design</li>
            </ul>
          </div>

          {/* Development */}
          {/* <div className="bg-gradient-to-br from-green-200 to-green-100 rounded-lg p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-green-800 mb-2">Development</h3>
            <p className="text-sm text-gray-700">
              Start building real-world apps using the latest tools and frameworks.
            </p>
            <ul className="mt-3 list-disc list-inside text-sm text-gray-600">
              <li>Frontend & Backend Projects</li>
              <li>Authentication & Deployment</li>
              <li>React, Node, MongoDB, Tailwind</li>
            </ul>
          </div> */}

        </div>
      </section>

      {/* === Footer CTA === */}
      <footer className="text-center py-10 px-4 bg-indigo-700 text-white">
        <h3 className="text-xl font-semibold mb-2">Ready to Level Up Your CSE Journey?</h3>
        <p className="text-sm mb-4">Start practicing, learning, and building today.</p>
        <Link
          to="/register "
          className="inline-block bg-white text-indigo-700 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition"
        >
          Start Now →
        </Link>
      </footer>
    </div>
  );
}
