const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');

// @route   GET /api/providers/search
// @desc    Search and filter businesses
router.get('/search', async (req, res) => {
  try {
    const { category, price, query } = req.query;
    let filter = {};

    // 1. Filter by Category
    if (category) filter.category = category;

    // 2. Filter by Price Tier ($, $$, etc.)
    if (price) filter.priceTier = price;

    // 3. Keyword Search (Matches name, description, or tags)
    if (query) {
      filter.$or = [
        { businessName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ];
    }

    const results = await Provider.find(filter).sort({ "metrics.avgRating": -1 });
    res.json(results);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;