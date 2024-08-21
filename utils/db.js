const { DataSource } = require('typeorm');
const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');
const Session = require('../models/Session');
const ActivityLog = require('../models/ActivityLog');

const AppDataSource = new DataSource({
  type: 'postgres',
  url: `postgres://postgres:12345@localhost:5432/bookstore_db`,
  synchronize: true,
  logging: false,
  entities: [User, Book, Order, Session, ActivityLog],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

module.exports = AppDataSource;
