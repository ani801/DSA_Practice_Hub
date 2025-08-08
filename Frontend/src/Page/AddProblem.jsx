import { useState, useContext, useMemo } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Url } from "../App";
import PracticeContext from "../context/PracticeContext";
import Navbar from "../Components/Navbar";

export default function AddProblem() {
  const { topics, problems, setTrigger } = useContext(PracticeContext);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [form, setForm] = useState({
    url: "",
    title: "",
    difficulty: "",
    tags: "",
  });

  // Unique problem URLs (memoized)
  const uniqueUrls = useMemo(() => {
    const set = new Set();
    problems?.forEach(p => p.url && set.add(p.url));
    return set;
  }, [problems]);

  // Filtered suggestions (memoized)
  const filteredTopics = useMemo(() => {
    return topics
      .filter(t => t !== "All Topics" && t.toLowerCase().includes(form.tags.toLowerCase()));
  }, [form.tags, topics]);

  // Extract problem name from URL
  const extractProblemName = (url) => {
    try {
      const path = new URL(url).pathname.split("/").filter(Boolean);
      if (url.includes("leetcode.com") || url.includes("geeksforgeeks.org")) {
        return path[1] || "Invalid URL";
      }
    } catch {
      return "Invalid URL";
    }
    return "Invalid URL";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmed = value.trim();

    if (name === "url") {
      if (uniqueUrls.has(trimmed)) {
        toast.error("This URL already exists in the problems list!");
        return;
      }
      const title = extractProblemName(trimmed);
      if (title !== "Invalid URL") {
        setForm(prev => ({ ...prev, title }));
      }
    }

    setForm(prev => ({ ...prev, [name]: trimmed }));
  };

  const handleSuggestionClick = (selected) => {
    setForm(prev => ({ ...prev, tags: selected }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { url, title, difficulty, tags } = form;

    if (!url || !title || !difficulty || !tags) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      const { data } = await axios.post(`${Url}/api/dsa/add`, {
        url, title, difficulty, tags
      }, { withCredentials: true });

      if (data.success) {
        toast.success("Problem added successfully!");
        setForm({ url: "", title: "", difficulty: "", tags: "" });
        setTrigger(Date.now());
      } else {
        toast.error(data.message || "Failed to add problem. Please try again.");
      }
    } catch (err) {
      console.error("Error adding problem:", err);
      toast.error("Failed to add problem. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-24 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-6 py-5 flex items-center justify-center">
        <div className="bg-white p-7 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">➕ Add New DSA Problem</h2>
          <form onSubmit={handleSubmit}>
            {/* URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Problem URL</label>
              <input
                type="url"
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                required
              />
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Problem Name</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Longest Common Subsequence"
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                required
              />
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                required
              >
                <option value="" disabled>Select a category</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Tags */}
            <div className="mb-6 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Start typing or select..."
                className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                required
                autoComplete="off"
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              {showSuggestions && filteredTopics.length > 0 && (
                <ul className="absolute z-10 bg-white w-full border rounded-md mt-1 max-h-40 overflow-y-auto shadow-md">
                  {filteredTopics.map((topic, idx) => (
                    <li
                      key={idx}
                      onMouseDown={() => handleSuggestionClick(topic)}
                      className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition"
            >
              Add Problem
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
