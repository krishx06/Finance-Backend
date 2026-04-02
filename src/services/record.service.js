import Record from "../models/record.model.js";

export const createRecord = async (data, userId) => {
  const record = await Record.create({ ...data, user: userId });
  return record;
};

export const getRecords = async (filters, user) => {
  const query = {};

  if (user.role !== "admin") {
    query.user = user.id;
  }

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }

  return await Record.find(query)
    .populate("user", "name email")
    .sort({ date: -1 });
};

export const updateRecord = async (recordId, data) => {
  const record = await Record.findByIdAndUpdate(recordId, data, { new: true });

  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }

  return record;
};

export const deleteRecord = async (recordId) => {
  const record = await Record.findByIdAndDelete(recordId);

  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }

  return record;
};
