const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const universityRoutes = require('./routes/universityRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { importDataFromJSON } = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB Connection String
const MONGODB_URI = 'mongodb+srv://parthiv:parthiv@cluster0.f9yy2cg.mongodb.net/?appName=Cluster0';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✓ Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('✗ Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

// Routes
app.use('/api', universityRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Start server
const server = app.listen(PORT, async () => {
  console.log(`\n🎓 University Search API Server`);
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api\n`);
  
  // Import data on startup
  await importDataFromJSON();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
