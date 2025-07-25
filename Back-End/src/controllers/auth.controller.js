import bcrypt from "bcryptjs";

import User from "../models/user.model.js";


export const signup = async (req, res) => {
  console.log("👉 Incoming body:", req.body); // Add this

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

    if (newUser) {
      // generate JWT token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        profilepic: newUser.profilepic,
      });
    } else {
      res.status(400).json({ message: "Invalid User data" }); 
    }
  } catch (error) {
    console.log("Error in Signup Controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};


export const login = (req, res) => {
    res.send('login route');
};

export const logout = (req, res) => {
    res.send('logout route');
};