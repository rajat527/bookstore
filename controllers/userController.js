// controllers/userController.js
const AppDataSource = require('../utils/db');
const Order = require('../models/Order');
const emailService = require('../services/emailService');
const Book = require('../models/Book');
const User = require('../models/User');



// If approved, make the book details visible to users. 

exports.getAllBooks = async (req, res) => {
  try {
    const bookRepository = AppDataSource.getRepository(Book);
    const userRepository = AppDataSource.getRepository(User);

    const books = await bookRepository.find({ where: { isApproved: true } });
    console.log("=== books===",books)

    const userIds = [...new Set(books.map(book => book.createdBy))];

    const users = await userRepository.findByIds(userIds);

    const userMap = new Map(users.map(user => [user.id, user]));

    const booksWithUserDetails = books.map(book => ({
      ...book,
      user: {
        id: userMap.get(book.createdBy)?.id || null,
        name: userMap.get(book.createdBy)?.name || null,
        email: userMap.get(book.createdBy)?.email || null,
        createdAt: userMap.get(book.createdBy)?.email || null,
      }
    }));
    res.status(200).json({ message: "Success", books: booksWithUserDetails });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


exports.purchaseBook = async (req, res) => {
  const { bookId, quantity = 1 } = req.body;
  if (!bookId) {
    return res.status(400).json({ message: 'bookId is required.' });
  }
  console.log({ userId: req.user.id, bookId, quantity })
  const orderRepository = AppDataSource.getRepository(Order);
  const bookRepository = AppDataSource.getRepository(Book);


  const book = await bookRepository.findOne({ where: { id:bookId } });

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  const order = orderRepository.create({ userId: req.user.id, bookId, quantity });
  await orderRepository.save(order);

  await emailService.notifySuperAdmin('New book order placed', order);

  res.status(200).json({ message: 'Book ordered successfully and Super Admin notified' });
};


