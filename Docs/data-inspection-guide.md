# AfterCare Data Inspection Guide

## MongoDB (Database) - Patient Tracker Entries

### View All Patient Tracker Entries
```bash
mongosh aftercare_db --eval "db.patient_trackers.find().pretty()"
```

### View Specific Patient's Entries
```bash
mongosh aftercare_db --eval "db.patient_trackers.find({patientId: 'demo-patient-001'}).pretty()"
```

### View Recent Entries (Last 10)
```bash
mongosh aftercare_db --eval "db.patient_trackers.find().sort({timestamp: -1}).limit(10).pretty()"
```

### View Entries with Warning Signs
```bash
mongosh aftercare_db --eval "db.patient_trackers.find({warningSignsPresent: true}).pretty()"
```

### Count Total Entries
```bash
mongosh aftercare_db --eval "db.patient_trackers.countDocuments()"
```

### View Database Statistics
```bash
mongosh aftercare_db --eval "db.stats()"
```

## Redis (Cache) - Cached API Responses

### List All Cache Keys
```bash
redis-cli keys "*"
```

### View Specific Cached Response
```bash
redis-cli get "cache:GET:/brochures/myomectomy"
```

### View Cache with Pretty JSON
```bash
redis-cli get "cache:GET:/brochures/myomectomy" | python3 -m json.tool
```

### Check Cache TTL (Time To Live)
```bash
redis-cli ttl "cache:GET:/brochures/myomectomy"
```

### View All Cache Keys with TTL
```bash
redis-cli keys "*" | xargs -I {} sh -c 'echo "Key: {}"; redis-cli ttl {}'
```

### Clear All Cache
```bash
redis-cli flushall
```

## API Endpoints for Data Access

### Get Patient Tracker Entries via API
```bash
curl -s http://localhost:3000/trackers/demo-patient-001 | python3 -m json.tool
```

### Get All Available Brochures
```bash
curl -s http://localhost:3000/brochures | python3 -m json.tool
```

### Clear Cache via API
```bash
curl -X POST http://localhost:3000/admin/cache/clear
```

## Quick Data Summary Commands

### Database Summary
```bash
echo "=== MONGODB SUMMARY ===" && \
echo "Total patient tracker entries:" && \
mongosh aftercare_db --eval "db.patient_trackers.countDocuments()" --quiet && \
echo "Recent entries:" && \
mongosh aftercare_db --eval "db.patient_trackers.find().sort({timestamp: -1}).limit(3).pretty()" --quiet
```

### Cache Summary
```bash
echo "=== REDIS CACHE SUMMARY ===" && \
echo "Cache keys:" && \
redis-cli keys "*" && \
echo "Cache size:" && \
redis-cli dbsize
```

## Data Structure Examples

### Patient Tracker Entry Structure
```json
{
  "_id": "ObjectId('688488b0bb4f69d959467afb')",
  "patientId": "demo-patient-001",
  "procedureType": "myomectomy",
  "symptoms": ["I feel drowsy (moderate)"],
  "notes": "I need to contact the office",
  "painLevel": null,
  "medications": [],
  "timestamp": "2025-07-26T07:50:08.246Z",
  "followUpNeeded": false,
  "warningSignsPresent": false
}
```

### Cached Response Structure
```json
{
  "success": true,
  "data": {
    "title": "Myomectomy Post-Operative Care Instructions",
    "lastUpdated": "2025-01-25",
    "contentVersion": "v1.0.0",
    "activityRestrictions": [...],
    "painManagement": [...],
    "warningSigns": [...]
  },
  "timestamp": "2025-07-26T07:37:33.679Z"
}
```

## Troubleshooting

### If MongoDB Connection Fails
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Restart MongoDB
brew services restart mongodb-community
```

### If Redis Connection Fails
```bash
# Check if Redis is running
brew services list | grep redis

# Restart Redis
brew services restart redis
```

### If API is Not Responding
```bash
# Check if server is running
ps aux | grep "node server.js"

# Restart server
cd server && npm start
``` 