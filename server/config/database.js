const { MongoClient } = require('mongodb');

let client = null;
let database = null;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'aftercare_db';

async function connectToDatabase() {
  try {
    if (client && database) {
      console.log('📊 Database already connected');
      return database;
    }

    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    database = client.db(DATABASE_NAME);
    
    // Test the connection
    await database.admin().ping();
    console.log('✅ Successfully connected to MongoDB');
    
    // Create indexes for better performance
    await createIndexes();
    
    return database;
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed (running without database):', error.message);
    // For MVP, we can run without database
    client = null;
    database = null;
    return null;
  }
}

async function createIndexes() {
  try {
    if (!database) return;
    
    const trackersCollection = database.collection('patient_trackers');
    
    // Create indexes for better query performance
    await trackersCollection.createIndex({ patientId: 1 });
    await trackersCollection.createIndex({ timestamp: -1 });
    await trackersCollection.createIndex({ procedureType: 1 });
    await trackersCollection.createIndex({ warningSignsPresent: 1 });
    
    console.log('📊 Database indexes created successfully');
  } catch (error) {
    console.error('Failed to create database indexes:', error);
  }
}

function getDatabase() {
  return database;
}

function getClient() {
  return client;
}

async function closeConnection() {
  try {
    if (client) {
      await client.close();
      client = null;
      database = null;
      console.log('🔌 Database connection closed');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, closing database connection...');
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, closing database connection...');
  await closeConnection();
  process.exit(0);
});

module.exports = {
  connectToDatabase,
  getDatabase,
  getClient,
  closeConnection
};
