const AppDataSource = require('../utils/db');
const ActivityLog = require('../models/ActivityLog');

exports.logActivity = (action) => {
  return async (req, res, next) => {
    const activityLogRepository = AppDataSource.getRepository(ActivityLog);
    const log = activityLogRepository.create({ userId: req.user.id, action });
    await activityLogRepository.save(log);
    next();
  };
};
