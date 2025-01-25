const { createClient } = require('redis');

let redisClient = null;
let isRedisConnected = false;

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const CACHE_TTL = process.env.CACHE_TTL || 300; // 5 minutes default

async function connectToRedis() {
  try {
    if (redisClient && isRedisConnected) {
      console.log('🔄 Redis already connected');
      return redisClient;
    }

    console.log('🔌 Connecting to Redis...');
    redisClient = createClient({
      url: REDIS_URL,
      socket: {
        connectTimeout: 3000, // Reduced timeout
        lazyConnect: true,
      },
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          console.warn('⚠️  Redis not available (running without cache)');
          return null; // Don't retry
        }
        if (options.total_retry_time > 1000 * 30) { // Reduced to 30 seconds
          console.warn('⚠️  Redis connection timeout');
          return null;
        }
        if (options.attempt > 2) { // Reduced attempts
          console.warn('⚠️  Redis max retry attempts reached');
          return null;
        }
        return Math.min(options.attempt * 100, 1000); // Reduced backoff
      }
    });

    // Error handling
    redisClient.on('error', (err) => {
      // Only log first error to reduce noise
      if (!isRedisConnected && err.code !== 'ECONNREFUSED') {
        console.warn('⚠️  Redis connection error:', err.message);
      }
      isRedisConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
      isRedisConnected = true;
    });

    redisClient.on('disconnect', () => {
      console.warn('⚠️  Redis disconnected');
      isRedisConnected = false;
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.warn('⚠️  Redis connection failed (running without cache):', error.message);
    redisClient = null;
    isRedisConnected = false;
    return null;
  }
}

// Cache middleware for Express routes
function cacheMiddleware(ttl = CACHE_TTL) {
  return async (req, res, next) => {
    if (!redisClient || !isRedisConnected) {
      return next();
    }

    const key = `cache:${req.method}:${req.originalUrl}`;
    
    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        console.log(`📦 Cache hit for ${key}`);
        const data = JSON.parse(cachedData);
        return res.json({
          ...data,
          cached: true,
          cacheTimestamp: new Date().toISOString()
        });
      }
      
      // Store original res.json to intercept response
      const originalJson = res.json;
      res.json = function(data) {
        // Cache the response
        if (res.statusCode === 200) {
          redisClient.setEx(key, ttl, JSON.stringify(data))
            .then(() => console.log(`💾 Cached response for ${key}`))
            .catch(err => console.warn('Cache write error:', err.message));
        }
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.warn('Cache middleware error:', error.message);
      next();
    }
  };
}

// Utility functions
async function getCache(key) {
  if (!redisClient || !isRedisConnected) return null;
  
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn('Cache get error:', error.message);
    return null;
  }
}

async function setCache(key, data, ttl = CACHE_TTL) {
  if (!redisClient || !isRedisConnected) return false;
  
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn('Cache set error:', error.message);
    return false;
  }
}

async function deleteCache(key) {
  if (!redisClient || !isRedisConnected) return false;
  
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.warn('Cache delete error:', error.message);
    return false;
  }
}

async function clearCache(pattern = '*') {
  if (!redisClient || !isRedisConnected) return false;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`🗑️  Cleared ${keys.length} cache entries`);
    }
    return true;
  } catch (error) {
    console.warn('Cache clear error:', error.message);
    return false;
  }
}

function getRedisClient() {
  return redisClient;
}

function isRedisReady() {
  return isRedisConnected;
}

// Graceful shutdown
async function closeRedisConnection() {
  try {
    if (redisClient && isRedisConnected) {
      await redisClient.quit();
      console.log('🔌 Redis connection closed');
    }
  } catch (error) {
    console.error('Error closing Redis connection:', error);
  }
}

process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, closing Redis connection...');
  await closeRedisConnection();
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, closing Redis connection...');
  await closeRedisConnection();
});

module.exports = {
  connectToRedis,
  cacheMiddleware,
  getCache,
  setCache,
  deleteCache,
  clearCache,
  getRedisClient,
  isRedisReady,
  closeRedisConnection
};
