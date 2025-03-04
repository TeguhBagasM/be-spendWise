const { Income, Expense } = require("../models");
const { Op } = require("sequelize");

exports.getFinancialSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalIncomeResult = await Income.sum("amount", {
      where: {
        user_id: userId,
      },
    });

    const totalExpensesResult = await Expense.sum("amount", {
      where: {
        user_id: userId,
      },
    });

    const totalIncome = totalIncomeResult || 0;
    const totalExpenses = totalExpensesResult || 0;

    const balance = totalIncome - totalExpenses;

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        balance,
      },
    });
  } catch (error) {
    console.error("Error in getFinancialSummary:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getFinancialSummaryByDateRange = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const dateFilter = {
      date: {
        [Op.between]: [startDate, endDate],
      },
      user_id: userId,
    };

    const totalIncomeResult = await Income.sum("amount", {
      where: dateFilter,
    });

    const totalExpensesResult = await Expense.sum("amount", {
      where: dateFilter,
    });

    const totalIncome = totalIncomeResult || 0;
    const totalExpenses = totalExpensesResult || 0;

    const balance = totalIncome - totalExpenses;

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        balance,
        period: {
          startDate,
          endDate,
        },
      },
    });
  } catch (error) {
    console.error("Error in getFinancialSummaryByDateRange:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getRecentTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    const recentIncomes = await Income.findAll({
      where: { user_id: userId },
      attributes: [
        "id",
        "source",
        "amount",
        "date",
        "created_at",
        [sequelize.literal('"income"'), "type"],
      ],
      order: [["date", "DESC"]],
      limit,
    });

    const recentExpenses = await Expense.findAll({
      where: { user_id: userId },
      attributes: [
        "id",
        "category",
        "amount",
        "date",
        "created_at",
        [sequelize.literal('"expense"'), "type"],
      ],
      order: [["date", "DESC"]],
      limit,
    });

    const allTransactions = [...recentIncomes, ...recentExpenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);

    res.status(200).json({
      success: true,
      data: allTransactions,
    });
  } catch (error) {
    console.error("Error in getRecentTransactions:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
