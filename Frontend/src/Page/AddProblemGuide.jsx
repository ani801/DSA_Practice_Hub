import React from "react";
import { BookOpenCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

// Sample steps
const steps = [
  {
    img: "../src/assets/images/step1.png",
    desc: "Step 1: Copy the problem link/url from the source you want to add."
  },
  {
    img: "../src/assets/images/step2.png",
    desc: "Step 2: Paste the problem link/url into the provided Problem URL input field."
  },
  {
    img: "../src/assets/images/step3.png",
    desc: "Step 3: Enter a title or name for the problem."
  },
  {
    img: "../src/assets/images/step4.png",
    desc: "Step 4: Select the difficulty level of the problem from the dropdown menu."
  },
  {
    img: "../src/assets/images/step5.png",
    desc: "Step 5: Select the topic tags that are relevant to the problem, if not present then type it."
  },
  {
    img: "../src/assets/images/step6.png",
    desc: "Step 6: Click the 'Add Problem' button to submit the problem for review."
  }
];

const AddProblemGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
        <Navbar/>

      {/* Main Content */}
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg">
            <BookOpenCheck size={20} />
            <span className="font-semibold text-lg">DSA Problem Submission Guide</span>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-800">🚀 How to Add a DSA Problem</h2>
          <p className="text-gray-600 mt-1 text-sm">Follow these simple steps to submit a new problem.</p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-white via-gray-50 to-purple-50 border border-purple-100 rounded-xl shadow-md p-4 hover:shadow-xl transition duration-300"
            >
              <img
                src={step.img}
                alt={`Step ${idx + 1}`}
                className="rounded-md mb-3 w-full max-h-[340px] object-contain border border-gray-200"
              />
              <p className="text-gray-800 font-medium">
                <span className="text-purple-700 font-semibold">✅ </span>{step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">🎯 Ready to try it yourself?</h3>
          <button
            onClick={() => navigate("/add-problem")}
            className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition duration-300"
          >
            ➕ Add DSA Problem
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProblemGuide;
