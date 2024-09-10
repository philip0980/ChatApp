import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { sendToken } from "../utils/features.js";

const newUser = async (req, res) => {
  const { name, username, password, bio } = req.body;
  const avatar = {
    public_id: "afdsfa",
    url: "safsafa",
  };
  const user = await User.create({
    name,
    username,
    password,
    bio,
    avatar,
  });

  sendToken(res, user, 201, "User Created");
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");
    if (!user) return next(new Error("Invalid Credentials"));

    const isMatch = await compare(password, user.password);

    if (!isMatch) return next(new Error("Invalid Credentials"));

    sendToken(res, user, 200, `Welcome back , ${user.name} created`);
  } catch (error) {
    next(error);
  }
};

const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

const logout = (req, res) => {
  res
    .status(200)
    .cookie("chattu-token", "", {
      maxAge: 0,
      httpOnly: true,
      secure: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

const searchUser = async (req, res) => {
  try {
    const { name } = req.query;

    const user = await User.find({ name: name });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: user,
      me: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export { login, newUser, getMyProfile, logout, searchUser };
