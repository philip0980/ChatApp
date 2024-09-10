// Server-side code (Node.js with Socket.IO)
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { connect_db } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import cors from "cors";
import { group } from "node:console";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

connect_db();

// Middlewares
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/chat", chatRoute);

app.use(errorMiddleware);

// Store users and socket mappings
const users = new Map(); // Maps userId to socketId

io.on("connection", (socket) => {
  console.log(`A user connected with socket id: ${socket.id}`);

  socket.on("register", (userId) => {
    users.set(userId, socket.id); // Store the mapping
    console.log(`User ${userId} registered with socket id ${socket.id}`);
  });

  socket.on("sent-message", ({ message, toSocketId }) => {
    console.log(`Message: ${message}, To: ${toSocketId}`);

    // Retrieve the socket ID for the recipient user
    const recipientSocketId = users.get(toSocketId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("message", {
        message,
        fromSocketId: socket.id,
      });
      console.log(`Message sent to ${recipientSocketId}`);
    } else {
      console.log(`User with ID ${toSocketId} is not connected.`);
    }

    socket.on("join-group", ({ groupId }) => {
      socket.join(groupId);
      console.log(`User joined group ${groupId}`);
    });

    socket.on("send-group-message", async ({ groupId, sender, content }) => {
      const message = { sender, content };
      io.to(groupId).emit("send-group-message", message);
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");

    // Remove user from map when disconnected
    for (const [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log("Server is running at port 3000");
});
