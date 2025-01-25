// MongoDB initialization script
// This runs when the MongoDB container starts for the first time

db = db.getSiblingDB('aftercare_db');

// Create collections with proper indexes
db.createCollection('patient_trackers');

// Create indexes for better performance
db.patient_trackers.createIndex({ "patientId": 1 });
db.patient_trackers.createIndex({ "timestamp": -1 });
db.patient_trackers.createIndex({ "procedureType": 1 });
db.patient_trackers.createIndex({ "warningSignsPresent": 1 });

// Create a user for the application
db.createUser({
  user: "aftercare_user",
  pwd: "aftercare_password",
  roles: [
    { role: "readWrite", db: "aftercare_db" }
  ]
});

print('✅ Aftercare database initialized successfully'); 