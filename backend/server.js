const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// 1. Import Routes
const authRoutes = require('./routes/authRoutes');
const providerRoutes = require('./routes/providerRoutes');

const app = express();

// 2. Connect to MongoDB
connectDB();

// 3. Middleware
app.use(cors());
app.use(express.json()); // Essential for parsing JSON data sent from React

// 4. Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);

// Test Route
app.get('/', (req, res) => res.send('Binnect API Running...'));

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
});