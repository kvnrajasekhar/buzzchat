const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    disappearMode: { type: Boolean, default: false },
    // filename: "audio.wav",
    filename: { type: String, trim: true },
    // contentType: "audio/wav",
    contentType: { type: String, trim: true },
    // audioBlob: audioBlob,
    audioBlob: { type: String, trim: true },
    image: { type: String, trim: true },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageModel);

module.exports = Message;
