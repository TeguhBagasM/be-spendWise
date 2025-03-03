const express = require("express");
const router = express.Router();
const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const { protect } = require("../middlewares/auth");

router.use(protect);

router.route("/").get(getAllExpenses).post(createExpense);

router.route("/:id").get(getExpenseById).put(updateExpense).delete(deleteExpense);

module.exports = router;
