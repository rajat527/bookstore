const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
    },
    email: {
      type: 'varchar',
      unique: true,
    },
    password: {
      type: 'varchar',
    },
    role: {
        type: 'enum',
        enum: ['superadmin', 'admin', 'user'],
        default: 'user',
      },
      createdAt: {
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
      },
  },
});
