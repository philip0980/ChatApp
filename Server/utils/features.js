import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const connect_db = () => {
  mongoose
    .connect(process.env.DATABASE_URI)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log(error);
    });
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  return res
    .status(code)
    .cookie("chattu-token", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
    })
    .json({
      success: true,
      token,
      message,
      user,
    });
};

const emitEvent = (req, event, users, data) => {
  console.log("Emitting event", event);
};

export { connect_db, sendToken, emitEvent };
