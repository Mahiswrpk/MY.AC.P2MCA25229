// notification_app_be/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const logger = require('../logging_middleware/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Health route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AffordMed Notification Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);

  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

// IMPORTANT: bind explicitly to 127.0.0.1
app.listen(PORT, '127.0.0.1', () => {
  console.log(`[SERVER] AffordMed backend running on http://127.0.0.1:${PORT}`);
});