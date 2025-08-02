import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Add this import
import User from "../models/user.model.js";


export const signup = async (req, res) => {
  console.log("👉 Incoming body:", req.body); 

  const { fullName, email, password } = req.body;



  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save(); // Save the user to the database

    if (newUser) {
      // Generate JWT token here
      const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        profilepic: newUser.profilepic,
        token, // Send the token in the response
      });
    } else {
      res.status(400).json({ message: "Invalid User data" });
    }
  } catch (error) {
    console.log("Error in Signup Controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });

      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
       
        if (!isPasswordCorrect) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          _id: user._id,
          fullName: user.fullName,
          profilepic: user.profilepic,
          token, // Send the token in the response
        });
    
    } catch (error) {
      console.log("Error in Login Controller", error.message);
      res.status(500).json({ message: "Internal server Error" });
    }
  }
export const logout = (req, res) => {
  try {
    res.cookie("JWT", "", {
      maxAge: 0, // Clear the cookie
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
    
  } catch (error) {
    console.log("Error in Logout Controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
    
  }
    
}
