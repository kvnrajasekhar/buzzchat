// import { protect } from "../middleware/authMiddleware.js";
const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const {
  accessChat,
  fetchChats,
  createGroupChat,
  rename,
  addToGroup,
  removeFromGroup,
  updatePic,
  updateGroupAdmin,
} = require("../controllers/chatControllers");

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, rename);
router.route("/updatePic").put(protect, updatePic);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremover").put(protect, removeFromGroup);
router.route("/updateGroupAdmin").put(protect, updateGroupAdmin);

module.exports = router;
