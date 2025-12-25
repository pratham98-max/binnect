const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Binnect API Running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
const providerRoutes = require('./routes/providerRoutes');

// ... other middlewares
app.use('/api/providers', providerRoutes);