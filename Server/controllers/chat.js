import { ALERT, REFETCH_CHATS } from "../constants/events.js";
import { Chat } from "../models/chat.js";
import { emitEvent } from "../utils/features.js";

const newGroupChat = async (req, res, next) => {
  const { name, members } = req.body;

  if (members.length < 2)
    return next(new Error("Group chat must have at least 3 members"));

  const allMembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({
    success: true,
    message: "Group chat created",
  });
};

const getMyChats = async (req, res, next) => {
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name avatar"
  );
  return res.status(200).json({
    success: true,
    chats,
  });
};

export { newGroupChat, getMyChats };
