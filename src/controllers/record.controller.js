import * as recordService from "../services/record.service.js";
import { success } from "../utils/apiResponse.js";

export const createRecord = async (req, res, next) => {
  try {
    const record = await recordService.createRecord(req.body, req.user.id);
    success(res, 201, "Record created", record);
  } catch (error) {
    next(error);
  }
};

export const getRecords = async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type,
      category: req.query.category,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      search: req.query.search,
    };
    const pagination = {
      page: req.query.page,
      limit: req.query.limit,
    };
    const result = await recordService.getRecords(filters, req.user, pagination);
    success(res, 200, "Records fetched", result);
  } catch (error) {
    next(error);
  }
};

export const updateRecord = async (req, res, next) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.body);
    success(res, 200, "Record updated", record);
  } catch (error) {
    next(error);
  }
};

export const deleteRecord = async (req, res, next) => {
  try {
    await recordService.deleteRecord(req.params.id);
    success(res, 200, "Record deleted");
  } catch (error) {
    next(error);
  }
};
