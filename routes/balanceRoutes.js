const express = require("express");
const router = express.Router();
const balanceController = require("../controllers/balanceController");
const { protect } = require("../middlewares/auth");

router.get("/summary", protect, balanceController.getFinancialSummary);

router.get("/summary-by-date", protect, balanceController.getFinancialSummaryByDateRange);

router.get("/recent-transactions", protect, balanceController.getRecentTransactions);

router.get("/monthly-balance", protect, balanceController.getMonthlyBalance);

module.exports = router;
