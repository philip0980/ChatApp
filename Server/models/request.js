import mongoose, { Schema, Types, model } from "mongoose";

const schema = new Schema(
  {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    reciever: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Request = model("Request", schema);
