const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, trim: true, required: true }, // Change field name to 'password'
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userModel.methods.matchPassword = async function (enteredPassword) {
  console.log("in match password");
  console.log("entered", enteredPassword);
  console.log("this", this.password);
  return await bcrypt.compare(enteredPassword, this.password);
};

userModel.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = mongoose.model("User", userModel);
module.exports = User;
