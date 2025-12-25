const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const { protect } = require('../middleware/authMiddleware');

/**
 * 1. GET ALL PROVIDERS (Explore Page)
 */
router.get('/', async (req, res) => {
  try {
    const providers = await Provider.find().sort({ createdAt: -1 });
    res.json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 2. GET USER WORKSPACE (Dashboard)
 * CRITICAL: This MUST be placed above the '/:id' route.
 * If placed below, Express treats 'my-workspace' as a provider ID.
 */
router.get('/my-workspace', protect, async (req, res) => {
  try {
    // protect middleware provides req.user.uid
    const niches = await Provider.find({ ownerId: req.user.uid }).sort({ createdAt: -1 });
    
    // Logging for debugging - check your terminal!
    console.log(`Workspace: Found ${niches.length} niches for UID: ${req.user.uid}`);
    
    res.json(niches);
  } catch (err) {
    res.status(500).json({ error: "Failed to load workspace data" });
  }
});

/**
 * 3. GET SINGLE PROVIDER BY ID (Profile Page)
 */
router.get('/:id', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Niche not found" });
    res.json(provider);
  } catch (err) {
    res.status(500).json({ error: "Invalid ID format" });
  }
});

/**
 * 4. REGISTER NEW NICHE
 */
router.post('/', protect, async (req, res) => {
  try {
    // Ensure ownerId is saved from the authenticated user
    const newProvider = new Provider({
      ...req.body,
      ownerId: req.user.uid,
      reviews: [],
      activeUsers: []
    });
    const saved = await newProvider.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * 5. POST A REVIEW
 */
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Niche not found" });

    const newReview = {
      userId: req.user.uid,
      userName: req.user.name || "Verified Member",
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    provider.reviews.push(newReview);
    await provider.save();
    res.status(201).json(provider.reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;