import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

// ======================= SIGNUP =======================
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, profilePic, bio } = req.body;

    if (!fullName || !email || !password) {
      return res.json({
        success: false,
        message: "Full name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profilePicUrl = "";
    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic);
      profilePicUrl = upload.secure_url;
    }

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
      profilePic: profilePicUrl,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      message: "Account created successfully",
      token,
      userData: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("🔥 Signup error:", error);
    res.json({
      success: false,
      message: error.message || "Server error during signup",
    });
  }
};

// ======================= LOGIN =======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      userData: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("🔥 Login error:", error);
    res.json({
      success: false,
      message: error.message || "Server error during login",
    });
  }
};

// ======================= CHECK AUTH =======================
export const checkAuth = (req, res) => {
  res.json({
    success: true,
    userData: {
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      bio: req.user.bio,
      profilePic: req.user.profilePic,
      createdAt: req.user.createdAt,
    },
  });
};

// ======================= UPDATE PROFILE =======================
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;
    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    }

    res.json({
      success: true,
      userData: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profilePic: updatedUser.profilePic,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("🔥 Update profile error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
