import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import  dotenv  from "dotenv";
dotenv.config()


const userRegister = async (req, res) => {
    try {
  const {name, username, email, password } = req.body;
 

  // Validate input
  if (!name || !username || !email || !password) {
    return res.status(400).json({ success:false,message: "All fields are required" });
  }
//Check username already exists
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {               
    return res.status(400).json({ success:false,message: "Username already exists" });
  }

    // Check if the user already exists
    const existingUser = await User.findOne
    ({ email });
  if (existingUser) {
    return res.status(400).json({success:false, message: "User already exists" });
  }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,

    });

    // Save the user to the database
    await newUser.save();
    // Respond with success message
    res.status(201).json({success:true, message: "User registered successfully", user: { username, email } });
} catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({success:false, message: "Internal server error" });
  }

}

const userLogin = async (req, res) => {
    try {
        const {uniqueId, password } = req.body;
       console.log("Login request received:", req.body);
        // Validate input
        if (!uniqueId || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
        }
    
        // Find the user by email
        const user = await User.findOne({
            $or: [
              { username: uniqueId },
              { email: uniqueId }
            ]
          });
        console.log("User found:", user);
        if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
        }
    
        // Check the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password validation result:", isPasswordValid);
        if (!isPasswordValid) {
        return res.status(400).json({ success: false, message: "Invalid password" });
        }
    
        // Respond with success message and user data
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
        //make a cookie with the token
        res.cookie('token', token, {
            httpOnly: true,
            secure:false,// process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 3 * 60 * 60 * 1000 // 3 hours
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully", 
            user:user
        })


    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
    }

    const userMe = async (req, res) => {
      try {
        // Read the token from cookies
        const token = req.cookies.token;
    
        if (!token) {
          return res.status(401).json({ success: false, message: "Not authenticated" });
        }
    
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        // Find the user by ID from token payload
        const user = await User.findById(decoded.id).select("-password"); // exclude password
    
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
    
        // Return user info
        return res.status(200).json({
          success: true,
          user,
        });
    
      } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }
    };
    const userLogout = async (req, res) => {
      try {
        // Clear the token cookie
        res.clearCookie('token', { httpOnly: true, secure: false }); // Set secure to true in production
        return res.status(200).json({ success: true, message: "User logged out successfully" });
      } catch (error) {
        console.error("Error logging out user:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }
    };

    const userUpdate = async (req, res) => {
      try {
        const { username, email } = req.body;
    
        // Check if new username is already taken by another user
        if (username) {
          const existingUsername = await User.findOne({ username });
          if (
            existingUsername &&
            existingUsername._id.toString() !== req.user._id.toString()
          ) {
            return res
              .status(400)
              .json({ success: false, message: "Username already exists" });
          }
        }
    
        // Check if new email is already taken by another user
        if (email) {
          const existingEmail = await User.findOne({ email });
          if (
            existingEmail &&
            existingEmail._id.toString() !== req.user._id.toString()
          ) {
            return res
              .status(400)
              .json({ success: false, message: "Email already exists" });
          }
        }
    
        // Clean body: remove undefined or empty string fields
        const updates = {};
        for (const key in req.body) {
          if (
            req.body[key] !== undefined &&
            req.body[key] !== null &&
            req.body[key].toString().trim() !== ""
          ) {
            updates[key] = req.body[key].toString().trim();
          }
        }
    
        const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
          new: true,
          runValidators: true, // ensure mongoose schema validation
        });
    
        if (!updatedUser) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }
    
        res.json({ success: true, user: updatedUser });
      } catch (err) {
        console.error("Update error:", err);
        res
          .status(500)
          .json({ success: false, message: "Failed to update user" });
      }
    };
    
    

export {userRegister, userLogin,userMe,userLogout,userUpdate};