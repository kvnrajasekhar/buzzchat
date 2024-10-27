const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------- CORS Configuration -----------------

const corsOptions = {
  origin: process.env.NODE_ENV === "production" ? "https://buzzchat-alpha.vercel.app" : "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// ----------------- Route setup -----------------
app.get("/", (req, res) => res.send("API is listening"));
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ----------------- Error handling -----------------
app.use(notFound);
app.use(errorHandler);

// ----------------- Server and Socket.IO setup -----------------
// Replaced duplicate server initialization by removing `server2`.
// Consolidated the server initialization to a single `server` variable.
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`.blue.bold.underline));
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// ----------------- Socket.IO connection handling -----------------
io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id !== newMessageRecieved.sender._id) {
        socket.in(user._id).emit("message received", newMessageRecieved);
      }
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("disconnect", () => console.log("User disconnected"));

  // ----------------- Video chat -----------------
  socket.emit("me", socket.id);
  socket.on("callUser", ({ from, userToCall, signalData, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });
  socket.on("answerCall", (data) => io.to(data.to).emit("callAccepted", data.signal));
});
