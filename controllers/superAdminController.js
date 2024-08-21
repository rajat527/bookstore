const AppDataSource = require('../utils/db');
const User = require('../models/User');
const emailService = require('../services/emailService');
const bcrypt = require('bcrypt');
const Book = require('../models/Book');

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    // Check if email already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = userRepository.save({ name, email, password: hashedPassword, role });

    // Send user details via email
    await emailService.sendUserDetails(email, password);

    res.status(200).json({ message: `User with this email ID: ${email} has been successfully added with the role: ${role}`, user:req.body });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
};

exports.approveReject = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.query;

    const bookRepository = AppDataSource.getRepository(Book);
    const userRepository = AppDataSource.getRepository(User);


    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        message: "Missing action in the query or invalid action provided. Please send either 'approve' or 'reject' as the action."
      });
    }

    if (!id) {
      return res.status(400).json({ message: 'Book Id is required.' });
    }

    let book = await bookRepository.findOne({ where: { id } });
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    const isApproved = action === 'approve';

    if (book.isApproved === isApproved) {
      return res.status(400).json({ message: `Book is already ${action}d.` });
    }

    book.isApproved = isApproved;
    await bookRepository.save(book);


     // Send email if rejected
     if (!isApproved) {
      const admin = await userRepository.findOne({ where: { id: book.createdBy } });
      if (admin) {
        await emailService.notifyAdmin('Book Rejected', {
          title: book.title,
          author: book.author,
          rejectionReason: 'The book was rejected.'
        },admin?.email);
      } else {
        console.warn('Admin who created the book not found.');
      }
    }

    res.status(200).json({
      message: `Book status updated successfully to '${action}'.`,
      book
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

