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

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Expense Tracker API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/balance", balanceRoutes);

// Hapus bagian listen untuk Vercel
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, async () => {
//   console.log(`Server running on port ${PORT}`);
//   try {
//     await sequelize.authenticate();
//     console.log("Database connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// });

module.exports = app;
