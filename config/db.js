const mongoose = require("mongoose");

/**
 * Asynchronously connects to MongoDB using the URI from environment variables.
 *
 * @async
 * @function connectDB
 * @throws {Error} If connection to MongoDB fails, logs error and exits process.
 */
const connectDB = async () => {
  try {
    // The mongoose.connect method returns a promise that resolves when the connection is established.
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    // Log the error message and terminate the process with a failure code.
    console.error("❌ Config/db: MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
