const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String }, 
  // ADD THESE TWO FIELDS TO MATCH YOUR FORM:
  desiredService: { type: String }, 
  targetCustomer: { type: String }, 
  website: { type: String },
  ownerId: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Provider', providerSchema);