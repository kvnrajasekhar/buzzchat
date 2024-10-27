const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  sendAudioMessage,
  aiMessage,
} = require("../controllers/messageControllers");
const {
  allMessages,
  deleteMessage,
} = require("../controllers/messageControllers");
const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/audio").post(protect, sendAudioMessage);
router.route("/:chatId").get(protect, allMessages);
router.route("/:id").delete(protect, deleteMessage);
router.route("/chatbot").post(aiMessage);

module.exports = router;
