const { Income, Expense, sequelize, Sequelize } = require("../models");
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
        "icon",
        "date",
        "created_at",
        [sequelize.literal("'income'"), "type"],
      ],
      order: [["date", "DESC"]],
      limit,
    });

    const recentExpenses = await Expense.findAll({
      where: { user_id: userId },
      attributes: [
        "id",
        "category",
        "icon",
        "amount",
        "date",
        "created_at",
        [sequelize.literal("'expense'"), "type"],
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

exports.getMonthlyBalance = async (req, res) => {
  try {
    const userId = req.user.id; // Pastikan ini sesuai dengan middleware auth

    // Ambil total income dan expense per bulan
    const incomeData = await Income.findAll({
      where: { user_id: userId },
      attributes: [
        [Sequelize.fn("TO_CHAR", Sequelize.col("date"), "%Y-%m"), "month"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalIncome"],
      ],
      group: ["month"],
      raw: true,
    });

    const expenseData = await Expense.findAll({
      where: { user_id: userId },
      attributes: [
        [Sequelize.fn("TO_CHAR", Sequelize.col("date"), "%Y-%m"), "month"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalExpense"],
      ],
      group: ["month"],
      raw: true,
    });

    // Gabungkan data income dan expense
    const balanceData = incomeData.map((income) => {
      const expense = expenseData.find((e) => e.month === income.month) || { totalExpense: 0 };
      return {
        month: income.month,
        totalIncome: parseFloat(income.totalIncome),
        totalExpense: parseFloat(expense.totalExpense),
        balance: parseFloat(income.totalIncome) - parseFloat(expense.totalExpense),
      };
    });

    res.json({ success: true, data: balanceData });
  } catch (error) {
    console.error("Error fetching monthly balance:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
