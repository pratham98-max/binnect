const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const { protect } = require('../middleware/authMiddleware'); // Import the bouncer

// 1. REGISTER ROUTE (POST)
// This is what the "Confirm Registration" button talks to
router.post('/register', protect, async (req, res) => {
  try {
    const { 
      businessName, 
      category, 
      desiredService, 
      targetCustomer, 
      website 
    } = req.body;

    const newProvider = new Provider({
      businessName,
      category,
      description: desiredService, // Using your "desired service" as the description
      desiredService,
      targetCustomer,
      website,
      ownerId: req.user.uid // Automatically grabbed from the verified token
    });

    const savedProvider = await newProvider.save();
    res.status(201).json(savedProvider);
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Database Error: Could not save profile." });
  }
});

// 2. SEARCH ROUTE (GET)
// This is what your Explore Page talks to
router.get('/search', async (req, res) => {
  try {
    const { category, price, query } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (price) filter.priceTier = price;

    if (query) {
      filter.$or = [
        { businessName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { desiredService: { $regex: query, $options: 'i' } },
        { targetCustomer: { $regex: query, $options: 'i' } }
      ];
    }

    // Return the latest businesses first
    const results = await Provider.find(filter).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;