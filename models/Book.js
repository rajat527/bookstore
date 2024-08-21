const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Book',
  tableName: 'books',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    title: {
      type: 'varchar',
    },
    author: {
      type: 'varchar',
    },
    isApproved: {
      type: 'boolean',
      default: false,
    },
    createdBy: {
      type: 'int',
    },
  },
});
