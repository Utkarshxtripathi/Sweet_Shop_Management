

import express from 'express';
import Sweet from '../models/Sweet.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/', protect, async (req, res, next) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.status(200).json(sweets);
  } catch (error) {
    next(error);
  }
});


router.get('/search', protect, async (req, res, next) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};

    
    if (name) {
      query.name = { $regex: name, $options: 'i' }; 
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    const sweets = await Sweet.find(query).sort({ createdAt: -1 });
    res.status(200).json(sweets);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    res.status(200).json(sweet);
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, admin, async (req, res, next) => {
  try {
    const { name, category, price, quantity, description } = req.body;

    // Validation
    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({
        message: 'Please provide name, category, price, and quantity',
      });
    }

    const sweet = await Sweet.create({
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      description: description || '',
    });

    res.status(201).json(sweet);
  } catch (error) {
    next(error);
  }
});


router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const { name, category, price, quantity, description } = req.body;

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    
    if (name) sweet.name = name;
    if (category) sweet.category = category;
    if (price !== undefined) sweet.price = parseFloat(price);
    if (quantity !== undefined) sweet.quantity = parseInt(quantity);
    if (description !== undefined) sweet.description = description;

    const updatedSweet = await sweet.save();

    res.status(200).json(updatedSweet);
  } catch (error) {
    next(error);
  }
});


router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    await sweet.deleteOne();

    res.status(200).json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/purchase', protect, async (req, res, next) => {
  try {
    const { quantity = 1 } = req.body;
    const purchaseQuantity = parseInt(quantity);

    if (purchaseQuantity <= 0) {
      return res.status(400).json({
        message: 'Purchase quantity must be greater than 0',
      });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    if (sweet.quantity < purchaseQuantity) {
      return res.status(400).json({
        message: 'Insufficient quantity available',
      });
    }

    sweet.quantity -= purchaseQuantity;
    const updatedSweet = await sweet.save();

    res.status(200).json(updatedSweet);
  } catch (error) {
    next(error);
  }
});


router.post('/:id/restock', protect, admin, async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const restockQuantity = parseInt(quantity);

    if (!quantity || restockQuantity <= 0) {
      return res.status(400).json({
        message: 'Please provide a valid restock quantity greater than 0',
      });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    sweet.quantity += restockQuantity;
    const updatedSweet = await sweet.save();

    res.status(200).json(updatedSweet);
  } catch (error) {
    next(error);
  }
});

export default router;

