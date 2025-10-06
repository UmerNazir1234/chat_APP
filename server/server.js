import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userroutes.js";
import messageRouter from "./routes/messageRout.js";
import { Server } from "socket.io";
// create express app and http server
const app = express();
const server = http.createServer(app);

// initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" },
});
// store online users
export const userStockmap = {}; 

// socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("User connected:", userId);

  if (userId) userStockmap[userId] = socket.id;

  // Emit online users to all clients
  io.emit("getOnlineUsers", Object.keys(userStockmap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete userStockmap[userId];
    io.emit("getOnlineUsers", Object.keys(userStockmap));
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => res.send("server is running"));
// Routes
app.use("/api/auth", userRouter);
app.use("/api/message", messageRouter);

// connect to mongoDB
await connectDB();

if (process.env.NODE_ENV !== "production"){const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));}
// Export server for versal 
export default server;
