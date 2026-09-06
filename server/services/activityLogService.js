const ActivityLog = require('../models/ActivityLog');

/**
 * Records a platform action for the admin audit trail. This is best-effort —
 * a logging failure must never break the actual action it's recording, so
 * every call site should treat this as fire-and-forget (or at most
 * await + catch, never let it throw upward).
 *
 * See the model file for what must NEVER go into metadata.
 */
async function logActivity({ actor = null, actorRole, action, targetType, targetId = null, metadata = {} }) {
  try {
    return await ActivityLog.create({ actor, actorRole, action, targetType, targetId, metadata });
  } catch (error) {
    console.error('Activity log failed (non-fatal):', error.message);
    return null;
  }
}

module.exports = { logActivity };
