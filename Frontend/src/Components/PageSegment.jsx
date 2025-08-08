import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdNoteAdd } from "react-icons/md";

const PageSegment = ({
  setSelectedProblem,
  selectedTopic,
  filteredProblems,
  problems,
  checkedMap,
  handleCheckboxClick,
  handleDeleteProblem,
  setShowSecond,
  difficultyColors
}) => {
  // Pagination setup
  const problemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);
   useEffect(() => {
    // Reset to first page when topic changes
    setCurrentPage(1);
  }, [selectedTopic]);

  const totalPages = Math.ceil((filteredProblems?.length || 0) / problemsPerPage);

  const paginatedProblems = filteredProblems?.slice(
    (currentPage - 1) * problemsPerPage,
    currentPage * problemsPerPage
  );

  return (
    <main className="flex-1 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{selectedTopic}</h1>
        <span className="text-sm text-gray-500">0/{filteredProblems.length}</span>
      </div>

      <div className="w-full h-2 bg-pink-100 rounded-full mb-6">
        <div
          className="h-full bg-pink-400 rounded-full"
          style={{ width: `${(filteredProblems?.length / problems?.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {paginatedProblems.map((problem, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b p-4 hover:bg-pink-100"
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
              <span
                className={`px-2 py-1 rounded-full border ${difficultyColors[problem.difficulty]}`}
              >
                {problem.difficulty}
              </span>
              <button
                onClick={() => {
                  setShowSecond(true);
                  setSelectedProblem(problem); // Set the selected problem for note editing
                }}
                className="text-purple-600 text-2xl hover:text-purple-800"
                title="Add Note"
              >
                <MdNoteAdd />
              </button>
              <button
                onClick={() => handleDeleteProblem(problem._id)}
                className="text-green-500 hover:text-red-700 text-lg"
                title="Delete permanently"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {filteredProblems.length > problemsPerPage && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md border ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-pink-100"
            }`}
          >
            Prev
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md border ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-pink-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
};

export default PageSegment;
