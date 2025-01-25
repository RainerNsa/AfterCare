const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const brochures = require('./data/brochures');
const PatientTracker = require('./models/PatientTracker');
const { connectToDatabase, getDatabase } = require('./config/database');
const { connectToRedis, cacheMiddleware, clearCache } = require('./config/redis');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '1 minute'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middleware
app.use(compression()); // Enable gzip compression
app.use(helmet());
app.use(limiter); // Apply rate limiting to all requests
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Aftercare Backend API'
  });
});

// GET /brochures/myomectomy - Returns structured JSON of brochure content (cached)
app.get('/brochures/myomectomy', cacheMiddleware(600), (req, res) => { // Cache for 10 minutes
  try {
    const myomectomyBrochure = brochures.myomectomy;
    
    if (!myomectomyBrochure) {
      return res.status(404).json({
        error: 'Brochure not found',
        message: 'Myomectomy brochure content is not available'
      });
    }

    res.status(200).json({
      success: true,
      data: myomectomyBrochure,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching brochure:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve brochure content'
    });
  }
});

// GET /brochures - Returns list of available brochures (cached)
app.get('/brochures', cacheMiddleware(300), (req, res) => { // Cache for 5 minutes
  try {
    const availableBrochures = Object.keys(brochures).map(key => ({
      id: key,
      title: brochures[key].title,
      lastUpdated: brochures[key].lastUpdated
    }));

    res.status(200).json({
      success: true,
      data: availableBrochures,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching brochures list:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve brochures list'
    });
  }
});

// POST /trackers - Logs patient interactions (symptoms/notes)
app.post('/trackers', async (req, res) => {
  try {
    const trackerData = new PatientTracker(req.body);
    const validation = trackerData.validate();
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid tracker data provided',
        details: validation.errors
      });
    }

    // Save to database if connected, otherwise store in memory (for MVP)
    const db = getDatabase();
    let savedTracker;
    
    if (db) {
      const collection = db.collection('patient_trackers');
      const result = await collection.insertOne(trackerData.toDocument());
      savedTracker = { ...trackerData.toDocument(), _id: result.insertedId };
    } else {
      // Fallback for MVP without database
      savedTracker = { ...trackerData.toDocument(), _id: Date.now().toString() };
      console.log('Tracker saved (memory):', savedTracker);
    }

    res.status(201).json({
      success: true,
      data: savedTracker,
      message: 'Patient tracker entry created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating tracker entry:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create tracker entry'
    });
  }
});

// GET /trackers/:patientId - Get tracker entries for a specific patient
app.get('/trackers/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const db = getDatabase();
    let trackers = [];

    if (db) {
      const collection = db.collection('patient_trackers');
      trackers = await collection
        .find({ patientId })
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .toArray();
    }

    res.status(200).json({
      success: true,
      data: trackers,
      count: trackers.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching tracker entries:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve tracker entries'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Cache management endpoint (for development/admin)
app.post('/admin/cache/clear', (req, res) => {
  clearCache()
    .then(() => {
      res.status(200).json({
        success: true,
        message: 'Cache cleared successfully',
        timestamp: new Date().toISOString()
      });
    })
    .catch(error => {
      res.status(500).json({
        error: 'Failed to clear cache',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    });
});

// Start server
async function startServer() {
  try {
    console.log('🚀 Starting Aftercare Backend API...');
    
    // Try to connect to database (optional for MVP)
    const dbConnected = await connectToDatabase();
    
    // Try to connect to Redis (optional for caching)
    const redisConnected = await connectToRedis();
    
    // Log the running mode
    if (!dbConnected && !redisConnected) {
      console.log('📋 Running in MVP mode (no database/cache)');
    } else if (!dbConnected) {
      console.log('📋 Running with cache only (no database)');
    } else if (!redisConnected) {
      console.log('📋 Running with database only (no cache)');
    } else {
      console.log('📋 Running with full database and cache');
    }

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`📖 Brochures: http://localhost:${PORT}/brochures/myomectomy`);
      console.log(`🗑️  Cache management: http://localhost:${PORT}/admin/cache/clear`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
