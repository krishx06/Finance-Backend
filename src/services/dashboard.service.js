import Record from "../models/record.model.js";

const activeOnly = { $match: { isDeleted: { $ne: true } } };

export const getSummary = async () => {
  const result = await Record.aggregate([
    activeOnly,
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  const totalIncome = result.find((r) => r._id === "income")?.total || 0;
  const totalExpense = result.find((r) => r._id === "expense")?.total || 0;

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
  };
};

export const getCategoryBreakdown = async () => {
  const result = await Record.aggregate([
    activeOnly,
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        total: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);

  return result;
};

export const getMonthlyBreakdown = async () => {
  const result = await Record.aggregate([
    activeOnly,
    {
      $group: {
        _id: { $month: "$date" },
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        total: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);

  return result;
};

export const getRecentActivity = async () => {
  return await Record.find({ isDeleted: { $ne: true } })
    .populate("user", "name email")
    .sort({ date: -1 })
    .limit(5);
};
