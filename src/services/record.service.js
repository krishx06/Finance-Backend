import Record from "../models/record.model.js";

export const createRecord = async (data, userId) => {
  if (!data.amount || !data.type || !data.category) {
    const error = new Error("Amount, type, and category are required");
    error.statusCode = 400;
    throw error;
  }

  if (typeof data.amount !== "number" || data.amount <= 0) {
    const error = new Error("Amount must be a positive number");
    error.statusCode = 400;
    throw error;
  }

  if (!["income", "expense"].includes(data.type)) {
    const error = new Error("Type must be 'income' or 'expense'");
    error.statusCode = 400;
    throw error;
  }

  const record = await Record.create({ ...data, user: userId });
  return record;
};

export const getRecords = async (filters, user, pagination) => {
  const query = { isDeleted: false };

  if (user.role !== "admin") {
    query.user = user.id;
  }

  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = new RegExp(filters.category, "i");
  if (filters.search) {
    query.$or = [
      { category: new RegExp(filters.search, "i") },
      { note: new RegExp(filters.search, "i") },
    ];
  }

  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }

  const page = parseInt(pagination.page) || 1;
  const limit = parseInt(pagination.limit) || 10;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Record.find(query)
      .populate("user", "name email")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    Record.countDocuments(query),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateRecord = async (recordId, data) => {
  const record = await Record.findOneAndUpdate(
    { _id: recordId, isDeleted: false },
    data,
    { new: true }
  );

  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }

  return record;
};

export const deleteRecord = async (recordId) => {
  const record = await Record.findOneAndUpdate(
    { _id: recordId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }

  return record;
};
