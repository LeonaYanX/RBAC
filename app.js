const express = require("express");
const errorHandler = require("./middleware/errorMiddleware");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const activationRoutes = require("./routes/activationRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// prefix /api
app.use("/api/auth", authRoutes);
app.use("/api", activationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
//  swagger-ui
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// error handling middleware
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
