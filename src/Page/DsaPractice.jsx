import { useState, useEffect, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import PracticeContext from "../context/PracticeContext";
import CustomCalendar from "../Components/Calender";
import ConfirmPopup from "../Components/ConfirmPopup";
import { toast } from "react-toastify";
import axios from "axios";
import { Url } from "../App";
import dayjs from "dayjs";

const difficultyColors = {
  Easy: "text-green-600 border-green-300",
  Medium: "text-yellow-600 border-yellow-300",
  Hard: "text-red-600 border-red-300",
};

export default function DsaPractice() {
  const { problems, topics, isAuthenticated, setTrigger, potdProblem } = useContext(PracticeContext);
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  // const todayStr = new Date().toISOString().slice(0, 10);

  const [time, setTime] = useState(getFormattedTime());
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  );

  const [checkedMap, setCheckedMap] = useState({});
  const [pendingCheck, setPendingCheck] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [toBeModified, setToBeModified] = useState(null);

  const handleCheckboxClick = (e, problemId) => {
    e.preventDefault();
    if (!checkedMap[problemId] && !pendingCheck) {
      setPendingCheck(true);
      setShowPopup(true);
      setToBeModified(problemId);
    } else {
      setCheckedMap((prev) => ({ ...prev, [problemId]: false }));
    }
  };

  const handleDeleteProblem = (problemId) => {
    setShowPopup2(true);
    setToBeModified(problemId);
  };

  const handleConfirm = async () => {
    try {
      // Step 1: Mark as solved (common logic for all problems)
      const markResponse = await axios.post(`${Url}/api/dsa/update/${toBeModified}`, {}, {
        withCredentials: true,
      });
  
      if (!markResponse.data.success) {
        throw new Error("Failed to mark problem as solved");
      }
  
      // Step 2: Update checkbox and state
      setCheckedMap((prev) => ({ ...prev, [toBeModified]: true }));
      setTrigger(Date.now());
  
      // Step 3: Determine if it's POTD
      if (potdProblem && potdProblem._id === toBeModified) {
        const todayStr = dayjs().format("YYYY-MM-DD");
  
        try {
          const potdResponse = await axios.post(`${Url}/api/potd/add/${todayStr}`, {}, {
            withCredentials: true,
          });
  
          if (potdResponse.data.success) {
            toast.success("✅ Today's POTD marked as solved!");
          } else {
            toast.warn("✅ Problem solved, but failed to update POTD status.");
          }
        } catch (error) {
          toast.warn("✅ Problem solved, but error occurred while updating POTD.");
          console.error("POTD update error:", error);
        }
      } else {
        toast.success("✅ Problem marked as solved!");
      }
  
      // Step 4: Cleanup
      setShowPopup(false);
      setPendingCheck(false);
      setToBeModified(null);
  
    } catch (error) {
      console.error("Error confirming checkbox:", error);
      toast.error("❌ Failed to mark problem as solved.");
      setShowPopup(false);
      setPendingCheck(false);
      // DO NOT set checkbox true
    }
  };
  

  const handleCancel = () => {
    setShowPopup(false);
    setPendingCheck(false);
    setToBeModified(null)
  };

  const handleConfirmForDelete = async () => {
    try {
      const response = await axios.delete(`${Url}/api/dsa/delete/${toBeModified}`, { withCredentials: true });
      setShowPopup2(false);
      setToBeModified(null);
      if (response.data.success) {
        toast.success("Problem deleted successfully!");
        setTrigger(Date.now());
      } else {
        toast.error("Failed to delete problem.");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCancelForDelete = () => {
    setShowPopup2(false);
    setToBeModified(null);
  };

  function getRemainingTimeToday() {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const diff = end - now;
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }

  function getFormattedTime() {
    const { hours, minutes, seconds } = getRemainingTimeToday();
    return {
      getHours: hours < 10 ? `0${hours}` : hours,
      getMinutes: minutes < 10 ? `0${minutes}` : minutes,
      getSeconds: seconds < 10 ? `0${seconds}` : seconds,
    };
  }

  useEffect(() => {
    const interval = setInterval(() => setTime(getFormattedTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredProblems = useMemo(() => {
    if (selectedTopic === "All Topics") return problems;
    return problems.filter((p) => p.tags.includes(selectedTopic));
  }, [selectedTopic, problems]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login to access DSA Practice</h1>
          <Link
            to="/login"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      {showPopup &&!showPopup2&&(
        <ConfirmPopup
          message="Are you sure you have solved this problem now? This will mark it as solved."
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {showPopup2 &&!showPopup&&(
        <ConfirmPopup
          message="Are you sure you want to delete this problem permanently?"
          onConfirm={handleConfirmForDelete}
          onCancel={handleCancelForDelete}
        />
      )}

  <div className="flex flex-col lg:flex-row justify-between items-start gap-6 p-6">
  {/* Left Column: POTD + New Section */}
  <div className="w-full lg:w-[65%] flex flex-col gap-6">
    {/* POTD Box */}
    <div className="bg-gradient-to-br from-orange-100 via-yellow-50 to-purple-100 p-6 rounded-2xl shadow-xl text-gray-900 min-h-[200px] flex flex-col justify-between">
      {potdProblem ? (
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          {/* Left Side: Content */}
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-1">{date}</p>
            <h3 className="text-xl font-bold text-purple-900 mb-4">{potdProblem?.title}</h3>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <button
                onClick={() => window.open(potdProblem?.url, "_blank")}
                className="bg-purple-600 hover:bg-purple-700 px-5 py-2 text-sm text-white rounded-md transition font-semibold shadow-md"
              >
                🚀 Solve Now
              </button>

              <span className="text-sm font-bold text-yellow-700 px-3 py-1 bg-yellow-200 rounded-full shadow-sm">
                {potdProblem?.difficulty}
              </span>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-green-700">
              <input
                type="checkbox"
                checked={checkedMap[potdProblem?._id] || false}
                onChange={(e) => handleCheckboxClick(e, potdProblem?._id)}
                className="w-5 h-5 accent-green-600 rounded hover:scale-110 transition-transform duration-150"
              />
              Mark as Solved
            </label>
          </div>

          {/* Right Side: Countdown Timer */}
          <div className="bg-white px-6 py-3 rounded-xl shadow-inner border border-purple-200 flex gap-2 items-center justify-center min-w-[180px]">
            <div className="text-2xl font-mono text-purple-800">{String(time.getHours).padStart(2, "0")}</div>
            <span className="text-2xl font-bold text-purple-600">:</span>
            <div className="text-2xl font-mono text-purple-800">{String(time.getMinutes).padStart(2, "0")}</div>
            <span className="text-2xl font-bold text-purple-600">:</span>
            <div className="text-2xl font-mono text-purple-800">{String(time.getSeconds).padStart(2, "0")}</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-red-600 font-semibold text-lg mt-4">
          ❌ No Problem of the Day available right now.
        </div>
      )}
    </div>

    {/* 🔽 New Section Below POTD */}
 <div className="bg-gradient-to-br from-indigo-100 via-white to-purple-100 rounded-2xl shadow-xl p-4 min-h-[162px] text-gray-900 flex flex-col justify-center">
  {/* Section Title */}
  <h3 className="text-lg font-bold text-indigo-800 mb-3 flex items-center gap-2">
    ✨ Add Your Own Challenge
  </h3>

  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    
    {/* Left: Add Problem Button */}
    <div className="flex items-center gap-3">
      <Link
        to="/add-Problem"
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm"
      >
        <span className="text-lg">➕</span> Add Problem
      </Link>

      {/* Description on the right of button (hidden on very small screens) */}
      <p className="hidden sm:block text-sm text-orange-600 max-w-[220px]">
      ( Make your own DSA list... )
      </p>
    </div>

    {/* Right: Guide Link */}
    <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-orange-200 rounded-md hover:bg-orange-100 transition duration-150">
      <span className="text-indigo-600 text-xl">📘</span>
      <Link
        to="/add-problem-guide"
        className="text-sm font-medium text-indigo-800 hover:underline"
      >
        View Step-by-step Guide
      </Link>
    </div>
  </div>
</div>


  </div>

  {/* Right Column: Calendar */}
  <div className="w-full lg:w-[35%] bg-white rounded-2xl shadow-xl p-4 min-h-[160px] flex flex-col justify-between">
    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-center rounded-lg p-1 mb-2">
      <p className="text-2xl font-bold">0 Days</p>
      <p className="text-sm">Start solving to begin your streak.</p>
    </div>
    <CustomCalendar />
  </div>
</div>
      <div className="flex flex-col sm:flex-row">
        <aside className="sm:w-1/4 w-full bg-white border-r p-4">
          <h2 className="text-lg font-semibold mb-4">Topics</h2>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selectedTopic === topic
                    ? "bg-orange-100 text-orange-600 border-orange-500"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{selectedTopic}</h1>
            <span className="text-sm text-gray-500">0/{filteredProblems.length}</span>
          </div>

          <div className="w-full h-2 bg-pink-100 rounded-full mb-6">
            <div
              className="h-full bg-pink-400 rounded-full"
              style={{ width: `${(filteredProblems.length / problems.length) * 100}%` }}
            ></div>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            {filteredProblems.map((problem, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b p-4 hover:bg-purple-100"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checkedMap[problem._id] || false}
                    onChange={(e) => handleCheckboxClick(e, problem._id)}
                    className="accent-purple-600"
                  />
                  <span className="text-xl sm:text-2xl">☆</span>
                  <span
                    onClick={() => window.open(problem.url, "_blank")}
                    className="text-sm hover:text-orange-500 sm:text-base font-medium cursor-pointer"
                  >
                    {problem.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span>⏱</span>
                  <span className={`px-2 py-1 rounded-full border ${difficultyColors[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                  <button className="text-purple-600 text-xl">＋</button>
                  <button
                    onClick={() => handleDeleteProblem(problem._id)}
                    className="text-green-500 hover:text-red-700 text-sm"
                    title="Delete permanently"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
