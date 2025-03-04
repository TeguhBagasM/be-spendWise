const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const balanceRoutes = require("./routes/balanceRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection test middleware
app.use(async (req, res, next) => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      error: "Database Connection Failed",
      message: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Expense Tracker API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/balance", balanceRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

module.exports = app;
