const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");
dotenv.config();
const connectDB = async () => {
  const conString = process.env.MONGO_URI;
  console.log(conString);
  try {
    const conn = await mongoose.connect(conString, {
      // usedNewUrlParser: true,
      useUnifiedTopology: true,
      //   useCreateIndex: true,
    });
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.blue.bold.underline
    );
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold.underline);
    process.exit(1);
  }
};
module.exports = connectDB;
