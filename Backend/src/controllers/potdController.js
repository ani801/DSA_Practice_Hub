import expressAsyncHandler from "express-async-handler";
import { Potd,PotdMonth } from "../models/potdModel.js";
import User from "../models/userModel.js";
import dayjs from "dayjs";
import redisClient from "../config/redisClient.js";


const getYearlyPotdData = async (userId, year) => {
  const user = await User.findById(userId).lean();
  if (!user) throw new Error("User not found");

  // Step 1: Find the potdref entry for the given year
  const yearRefEntry = user.potdref.find((ref) => ref.year === year);
  if (!yearRefEntry) return [];

  // Step 2: Get PotdMonth document for the year
  const potdMonthDoc = await PotdMonth.findById(yearRefEntry.year_ref).lean();
  if (!potdMonthDoc || !potdMonthDoc.allMonths) return [];

  const allDates = [];

  // Step 3: Loop through each month and collect dates
  for (const monthObj of potdMonthDoc.allMonths) {
    if (monthObj.potd_day.length > 0) {
      const potdDocs = await Potd.find({ _id: { $in: monthObj.potd_day } })
        .select("date -_id")
        .lean();

      const dates = potdDocs.map((doc) => doc.date);
      allDates.push(...dates); // flatten into single array
    }
  }

  return allDates; // 👈 return flat array of all solved dates in the year
};



 const yearlyPotdController = expressAsyncHandler(async (req, res) => {
  const year = req.params.year;

  if (!year || typeof year !== "string" || year.trim() === "") {
    return res.status(400).json({ success: false, message: "Invalid year format" });
  }
  
  if ( !year) {
    return res.status(400).json({ success: false, message: "Invalid year format" });
  }

  try {
    const userId = req.user._id;
    const potdProblems = await getYearlyPotdData(userId, year);
    res.status(200).json({ success: true, potdMonth: potdProblems });
  } catch (error) {
    console.error("Error fetching monthly POTD:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});



const addPotd = expressAsyncHandler(async (req, res) => {
  const dateStr = req.params.year_month_day; // e.g. "2025-06-27"
  //const problemId = req.body.problemId;
  const userId = req.user._id;

  if (!dateStr || typeof dateStr !== "string"  || !userId) {
    return res.status(400).json({
      success: false,
      message: "Date, and User ID are required",
    });
  }

  const all = dateStr.split("-"); // e.g. "2025", "06"
  const yearMonth = `${all[0]}-${all[1]}`;

  try {
    

    const user = await User.findById(userId);
    const newPotd = await Potd.create({
      date: dateStr,
      // problem: new mongoose.Types.ObjectId(problemId),
    });
 const year = all[0];
    // Step 2: Find or create PotdMonth for the year
    let potdMonthDoc = await PotdMonth.findOne({ year });

    if (!potdMonthDoc) {
      potdMonthDoc = await PotdMonth.create({
        year,
        allMonths: [
          {
            year_month: yearMonth,
            potd_day: [newPotd._id],
          },
        ],
      });
    } else {
      // Step 3: Find or add month in allMonths
      const existingMonth = potdMonthDoc.allMonths.find(
        (m) => m.year_month === yearMonth
      );

      if (existingMonth) {
        if (!existingMonth.potd_day.includes(newPotd._id)) {
          existingMonth.potd_day.push(newPotd._id);
        }
      } else {
        potdMonthDoc.allMonths.push({
          year_month: yearMonth,
          potd_day: [newPotd._id],
        });
      }
      await potdMonthDoc.save();
    }

const alreadyLinked = user.potdref.some(
  (ref) => ref?.year_ref?.toString() === potdMonthDoc._id.toString()
);

if (!alreadyLinked) {
  user.potdref.push({
    year: year,
    year_ref: potdMonthDoc._id,
  });
  await user.save();
}
    return res.status(201).json({
      success: true,
      message: "✅ POTD added successfully",
      potd: newPotd,
      
    });
  } catch (error) {
    console.error("Error adding POTD:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


// Helper: POTD selector
const selectPOTDFromArray = (problems, preferredTags = ["AllProblems"], today = new Date()) => {
  if (!Array.isArray(problems) || problems.length < 1) return null;

  const difficultyScore = { Hard: 3, Medium: 2, Easy: 1 };

  const filtered = Array.from(problems);
  filtered.sort((a, b) => {
    const aTagMatch = a.tags.filter(tag => preferredTags.includes(tag)).length;
    const bTagMatch = b.tags.filter(tag => preferredTags.includes(tag)).length;
    const tagDiff = bTagMatch - aTagMatch;
    if (tagDiff !== 0) return tagDiff;

    const countDiff = a.count - b.count;
    if (countDiff !== 0) return countDiff;

    const scoreDiff = difficultyScore[b.difficulty] - difficultyScore[a.difficulty];
    if (scoreDiff !== 0) return scoreDiff;

    const aLast = a.lastAttempted ? new Date(a.lastAttempted).getTime() : 0;
    const bLast = b.lastAttempted ? new Date(b.lastAttempted).getTime() : 0;
    return aLast - bLast;
  });

  const selected = filtered[0];
  selected.lastAttempted = today.toISOString();
  return selected;
};

// Main controller function
const getPOTD = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user is authenticated
    const todayKey = `potd:${userId}:${dayjs().format("YYYY-MM-DD")}`;

    // Check Redis first
    const cached = await redisClient.get(todayKey);
    if (cached) {
      return res.status(200).json({data:JSON.parse(cached),success: true, message: "POTD fetched from cache"});
    }

    // Fetch problems from DB
    const problems = await User.findById(userId).populate("problems");

   if (problems && problems.problems && problems.problems.length > 0) {
     const selected = selectPOTDFromArray(problems.problems);
     if (!selected) {
       return res.status(200).json({success: false, message: "No problems found." });
     }

    // Save to Redis until midnight
    const now = dayjs();
    const midnight = now.add(1, "day").startOf("day");
    const ttl = midnight.diff(now, "second");
    await redisClient.setEx(todayKey, ttl, JSON.stringify(selected));

    res.status(200).json({success:true,data:selected,message:"POTD fetched successfully"});
   }else{
      return res.status(200).json({ success: false, message: "No problems found." });
   }
  } catch (error) {
    console.error("POTD error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch POTD" });
  }
};





export { yearlyPotdController, addPotd ,getPOTD};