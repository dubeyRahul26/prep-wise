
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookies.js";



export const registerUser = async (req, res) => {

  const { name, email, password } = req.body;
  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const newUser = await User.create({ name, email, password });
    
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    generateTokenAndSetCookie(user._id , res);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};



export const logoutUser = (req, res) => {
  
  try {

    const token = req.cookies["jwt-token"];

    if (!token) {
      return res.status(200).json({ message: "User already logged out" });
    }

    res.cookie("jwt-token", "", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

