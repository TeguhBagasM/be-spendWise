const express = require("express");
const router = express.Router();
const {
  getAllIncome,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
} = require("../controllers/incomeController");
const { protect } = require("../middlewares/auth");

router.use(protect);

router.route("/").get(getAllIncome).post(createIncome);

router.route("/:id").get(getIncomeById).put(updateIncome).delete(deleteIncome);

module.exports = router;
