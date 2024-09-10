import express from "express";
import {
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
} from "../controllers/user.js";
import { multerUpload } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();

app.post("/new", multerUpload.single("avatar"), newUser);
app.post("/login", login);

// this route can be accessed when user is logged in

app.get("/me", isAuthenticated, getMyProfile);
app.get("/logout", isAuthenticated, logout);
app.get("/search", isAuthenticated, searchUser);

export default app;
