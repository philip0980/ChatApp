import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getMyChats, newGroupChat } from "../controllers/chat.js";

const app = express.Router();

// this route can be accessed when user is logged in

app.use(isAuthenticated);
app.post("/new", newGroupChat);
app.get("/my", getMyChats);

export default app;
