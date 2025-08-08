import DsaProblem from "../models/dsa-Problem.js";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";


// Controller to fetch DSA problems
const fetchDsaProblems = asyncHandler(async (req, res) => {
  try {
    // Fetch all DSA problems from the database based on the user's authentication
     
    
    const problems = await User.findById(req.user._id).populate("problems");

    res.status(200).json({ success: true, data: problems.problems });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
    console.error("Error fetching DSA problems:", error);
  }
});

// Controller to add a new DSA problem
const addDsaProblem = asyncHandler(async (req, res) => {
    const { title, url, difficulty, tags } = req.body;
   
    
    if (!title || !url || !difficulty || !tags) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    
    try {
        const newProblem = new DsaProblem({
        title,
        url,
        difficulty,
        tags
        });
    
        await newProblem.save();
        //add reference to user
        req.user.problems.push(newProblem._id);
        await req.user.save();
      
        res.status(201).json({ success: true, data: newProblem });
    } catch (error) {
      console.error("Error adding DSA problem:", error);
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
});

const deleteDsaProblem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const problem = await DsaProblem.findById(id);
        if (!problem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
        }
        await DsaProblem.findByIdAndDelete(id);
        // Remove reference from user
        req.user.problems = req.user.problems.filter((p) => p.toString() !== id);
        await req.user.save();
        res.status(200).json({ success: true, message: "Problem deleted successfully" });
    } catch (error) {
        console.error("Error deleting DSA problem:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

const updateDsaProblem = asyncHandler(async (req, res) => {
    const { id } = req.params;
   const solveDate=new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD forma
    try {
        const problem = await DsaProblem.findById(id);
        if (!problem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
        }
        problem.count += 1; // Increment the count
        problem.lastAttempted = solveDate; // Update the last attempted date
        await problem.save();
        res.status(200).json({ success: true, data: problem ,message:"You have solved the problem!"});
    } catch (error) {
        console.error("Error updating DSA problem:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Controller to update the note of a DSA problem
const updateDsaProblemNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { note } = req.body;
    try {
        const problem = await DsaProblem.findById(id);
        if (!problem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
            console.error("Problem not found:", id);
        }
        problem.note = note; // Update the note
        await problem.save();
        res.status(200).json({ success: true, data: problem, message: "Note updated successfully" });
    } catch (error) {
        console.error("Error updating DSA problem note:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Controller to fetch the note of a DSA problem
const fetchDsaProblemNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const problem = await DsaProblem.findById(id);
        if (!problem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
        }
        res.status(200).json({ success: true, data: problem.note });
    } catch (error) {
        console.error("Error fetching DSA problem note:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export { fetchDsaProblems, addDsaProblem, deleteDsaProblem, updateDsaProblem, fetchDsaProblemNote, updateDsaProblemNote };
