// backend/config/cors.js

require("dotenv").config();

const corsOptions = {
  origin: process.env.FRONTEND_URL, // e.g. http://localhost:3000
  optionsSuccessStatus: 200,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

module.exports = corsOptions;      // ← exports the object directly
// This is a CORS configuration file for an Express.js application.
// It specifies the allowed origins, HTTP methods, and other settings for cross-origin requests.