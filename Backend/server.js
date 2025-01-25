const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const brochures = require('./data/brochures');
const PatientTracker = require('./models/PatientTracker');
const { connectToDatabase, getDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

// GET /brochures/myomectomy - Returns structured JSON of brochure content
app.get('/brochures/myomectomy', (req, res) => {
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

// GET /brochures - Returns list of available brochures
app.get('/brochures', (req, res) => {
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

// Start server
async function startServer() {
  try {
    // Try to connect to database (optional for MVP)
    await connectToDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Aftercare Backend API running on port ${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`📖 Brochures: http://localhost:${PORT}/brochures/myomectomy`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
