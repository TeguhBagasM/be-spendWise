const { Expense } = require("../models");

// Get all expenses for a user
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { user_id: req.user.id },
      order: [["date", "DESC"]],
    });

    res.status(200).json({ expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get expense by ID
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create expense
exports.createExpense = async (req, res) => {
  try {
    const { category, amount, date, icon } = req.body;

    const expense = await Expense.create({
      user_id: req.user.id,
      category,
      amount,
      date,
      icon,
    });

    res.status(201).json({
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const { category, amount, date, icon } = req.body;

    const expense = await Expense.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.update({ category, amount, date, icon });

    res.status(200).json({
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.destroy();

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
