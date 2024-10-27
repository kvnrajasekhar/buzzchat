const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Token = require("../models/token");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../config/generateToken");
const passwordMailer = require("../mailers/password_mailer");
const sendEmail = require("../email_verification_utils/sendEmail");
const crypto = require("crypto");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  // check if user already exists
  let userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }
  // if user does not exist then create a new user

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  // if user is created then send the user details

  if (user) {
    // send verification email
    const token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    await token.save();
    const link = `${process.env.LOCALHOST}/user/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify your email", link);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
      msg: "Email sent. Please verify your email.",
    });

    console.log(user);
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const verifyUser = asyncHandler(async (req, res) => {
  // const { userId, token } = req.params;
  const userId = req.params.id;
  const token = req.params.token;
  // console.log(userId, token);
  const user = await Token.findOne({ _userId: userId });
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const tokenDoc = await Token.findOne({ token: token });
  if (!tokenDoc) {
    res.status(400);
    throw new Error("Invalid or expired verification link.");
  }

  const user1 = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        verified: true,
      },
    },
    { new: true }
  );
  await user.save();
  await Token.findOneAndDelete({ token: token });
  res.status(200);
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.verified) {
    let token = await Token.findOne({ _userId: user._id });

    if (!token) {
      token = new Token({
        _userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await token.save();
    }

    const link = `${process.env.LOCALHOST}/user/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify your email", link);
    return res.status(400).send({
      msg: "Email not verified. Verification link sent to your email.",
    });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    token: generateToken(user._id),
  });
});

// asking query using the url
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.userId;
  // console.log(id);
  try {
    const updated = await User.findById(id);
    // console.log(req.body.name);
    // console.log(req.body.name == undefined);
    if (req.body.name != undefined) {
      console.log("in if");
      updated.name = req.body.name;
    }
    // console.log(updated.name);
    // console.log(req.body.pic == "");
    if (req.body.pic != "") {
      console.log("in if pic ");
      updated.pic = req.body.pic;
    }
    const updatedUser = await User.findByIdAndUpdate(id, updated);
    res.json(updatedUser);
  } catch (err) {
    console.log(err);
  }
  // const user = await User.findById(id);
  // console.log(req.body.pic);
  // if(user){
  //   user.name = req.body.name || user.name;
  //   user.pic = req.body.pic || user.pic;

  // }
  // else{y
  //   res.status(404);
  //   throw new Error("User not found");
  // }
});

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const user_id = req.params.userId;
    const user = await User.findOne({ _id: user_id });

    if (user) {
      const isMatch = await user.matchPassword(req.body.oldPassword);

      if (isMatch) {
        if (req.body.newPassword == req.body.confirmPassword) {
          const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);
          const userData = await User.findByIdAndUpdate(
            { _id: user_id },
            {
              $set: {
                password: hashedNewPassword,
              },
            },
            { new: true }
          );
          console.log("password updated");
          res.json(userData);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
});

const forgotPassoword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log("user not found");
      res.status(404).json({ error: "User not found" });
      return;
    }
    const secret = process.env.JWT_SECRET + user.password;
    const payload = {
      email: user.email,
      id: user._id,
    };
    const token = jwt.sign(payload, secret, {
      expiresIn: "15m",
    });
    const link = `${process.env.LOCALHOST}/resetForgotPassword/${user._id}/${token}`;

    passwordMailer.forgotPasswordLink(user.email, link);
    res
      .status(200)
      .json({ success: true, message: "Email sent for password reset" });
  } catch (error) {
    console.error("Forgot password failed:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const postResetPassword = asyncHandler(async (req, res) => {
  try {
    const id = req.params.userId;
    const token = req.params.token;
    const { newPassword, cnfPassword } = req.body;
    if (newPassword !== cnfPassword) {
      console.log("Password do not password");
      res.status(400).json({ error: "passwords didn't match" });
      return;
    }
    const validUser = await User.findOne({ _id: id });
    if (!validUser) {
      console.log("not a valid user");
      res.status(404).json({ error: "Not a Valid User" });
      return;
    }
    const secret = process.env.JWT_SECRET + validUser.password;
    const payload = jwt.verify(token, secret);

    const hashPassword = await bcrypt.hash(newPassword, 12);

    const user = await User.findOneAndUpdate(
      { _id: payload.id, email: payload.email },
      {
        password: hashPassword,
      },
      { new: true }
    );

    if (!user) {
      console.log("user not found");
      res.status(404).json({ error: "User not found" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "password updated successfully" });
  } catch (err) {
    console.log("internal server error");
    res.status(500).json({ error: "Internal Server error" });
  }
});
module.exports = {
  registerUser,
  authUser,
  allUsers,
  updateUser,
  updatePassword,
  forgotPassoword,
  postResetPassword,
  verifyUser,
};
