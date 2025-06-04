import express from 'express';
import { Book } from '../models/bookModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all books for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id });
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get one book
router.get('/:id', protect, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Create a book
router.post('/', protect, async (req, res) => {
  try {
    const { title, author, publishYear } = req.body;

    const newBook = {
      title,
      author,
      publishYear,
      user: req.user._id,
    };

    const book = await Book.create(newBook);
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Update a book
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, author, publishYear } = req.body;

    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, publishYear },
      { new: true }
    );

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a book
router.delete('/:id', protect, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router; 