// controllers/incomeController.js
const { Income } = require("../models");

// Get all income for a user
exports.getAllIncome = async (req, res) => {
  try {
    const income = await Income.findAll({
      where: { user_id: req.user.id },
      order: [["date", "DESC"]],
    });

    res.status(200).json({ income });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get income by ID
exports.getIncomeById = async (req, res) => {
  try {
    const income = await Income.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json({ income });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create income
exports.createIncome = async (req, res) => {
  try {
    const { source, amount, date, icon } = req.body;

    const income = await Income.create({
      user_id: req.user.id,
      source,
      amount,
      date,
      icon,
    });

    res.status(201).json({
      message: "Income created successfully",
      income,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update income
exports.updateIncome = async (req, res) => {
  try {
    const { source, amount, date, icon } = req.body;

    const income = await Income.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    await income.update({ source, amount, date, icon });

    res.status(200).json({
      message: "Income updated successfully",
      income,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete income
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    await income.destroy();

    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
