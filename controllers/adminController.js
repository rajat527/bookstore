const AppDataSource = require("../utils/db");
const Book = require("../models/Book");
const emailService = require("../services/emailService");

// Create a Book
exports.createBook = async (req, res) => {
  try {
    const { title, author } = req.body;
    const bookRepository = AppDataSource.getRepository(Book);

    if (!title || !author) {
      return res.status(400).json({ message: "Title, author are required." });
    }

    const existingBook = await bookRepository.findOne({
      where: { title, author },
    });

    if (existingBook) {
      return res
        .status(409)
        .json({ message: "Book already exists with the same details." });
    }

    const book = bookRepository.create({
      title,
      author,
      approved: false,
      createdBy: req?.user?.id,
    });
    await bookRepository.save(book);

    await emailService.notifySuperAdmin("New Book Created", { title, author });

    res.status(201).json({ message: "Book created successfully", book });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update a Book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author } = req.body;
    const bookRepository = AppDataSource.getRepository(Book);

    if (!id) {
      return res.status(400).json({ message: "Book Id is required." });
    }
    if (!title || !author) {
      return res.status(400).json({ message: "Title, author are required." });
    }

    let book = await bookRepository.findOne({ where: { id } });
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    if (book?.createdBy !== req.user.id) {
      return res
        .status(400)
        .json({
          message:
            "Only the person who created the book has permission to update it.",
        });
    }

    book = Object.assign(book, { title, author });
    await bookRepository.save(book);

    await emailService.notifySuperAdmin("Book Updated", { title, author });

    res.status(200).json({ message: "Book updated successfully", book });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get All Books
exports.getAllBooks = async (req, res) => {
  try {
    const bookRepository = AppDataSource.getRepository(Book);
    const books = await bookRepository.find({
      where: { createdBy: req?.user?.id },
    });
    res.status(200).json({ message: "success", books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get a Book by ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Book Id is required." });
    }
    const bookRepository = AppDataSource.getRepository(Book);

    const book = await bookRepository.findOne({ where: { id } });
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.status(200).json({ message: "success", book });
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete a Book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Book Id is required." });
    }
    const bookRepository = AppDataSource.getRepository(Book);

    const book = await bookRepository.findOne({ where: { id } });
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    if (book?.createdBy !== req.user.id) {
      return res
        .status(400)
        .json({
          message:
            "Only the person who created the book has permission to delete it.",
        });
    }

    await bookRepository.remove(book);
    res.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
