const mongoose = require('mongoose');

function isValidEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function requireString(value, field, options = {}) {
  const { min = 1, max = 500 } = options;
  if (typeof value !== 'string') {
    const error = new Error(`${field} must be a string.`);
    error.statusCode = 400;
    throw error;
  }
  const normalized = value.trim();
  if (normalized.length < min || normalized.length > max) {
    const error = new Error(`${field} must be between ${min} and ${max} characters.`);
    error.statusCode = 400;
    throw error;
  }
  return normalized;
}

function requireObjectId(value, field) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    const error = new Error(`${field} must be a valid ID.`);
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function pagination(query) {
  const page = Math.max(1, Math.min(10000, Number.parseInt(query.page, 10) || 1));
  const limit = Math.max(1, Math.min(50, Number.parseInt(query.limit, 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

module.exports = { isValidEmail, requireString, requireObjectId, isValidObjectId, pagination };
