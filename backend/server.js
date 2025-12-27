const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

// 1. Import Routes
const authRoutes = require('./routes/authRoutes');
const providerRoutes = require('./routes/providerRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// 2. Connect to MongoDB
connectDB();

// 3. Middleware
// IMPROVED CORS: Added common variations of your Netlify URL
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://binnect.netlify.app',    // No trailing slash
    'https://binnect.netlify.app/'    // With trailing slash (to be safe)
  ],
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Added OPTIONS for preflight
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/ai', aiRoutes);

// Root / Test Route (Useful for checking if server is awake)
app.get('/', (req, res) => {
    res.send('🚀 Binnect API is live on Render...');
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong on the server!',
        error: process.env.NODE_ENV === 'development' ? err.message : {} 
    });
});

// 7. Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => { // Adding '0.0.0.0' helps Render bind correctly
    console.log(`🚀 Server started on port ${PORT}`);
});