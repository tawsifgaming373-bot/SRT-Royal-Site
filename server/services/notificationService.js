const Notification = require('../models/Notification');

async function createNotification({ user, type, message, metadata = {} }) {
  return Notification.create({ user, type, message, metadata });
}

module.exports = { createNotification };
