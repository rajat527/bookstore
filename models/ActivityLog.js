// models/ActivityLog.js
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'ActivityLog',
  tableName: 'activity_logs',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    userId: {
      type: 'int',
    },
    action: {
      type: 'varchar',
    },
    timestamp: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
});
