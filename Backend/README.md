# Aftercare Backend API

Backend API for the Aftercare Patient Management System, providing RESTful endpoints for patient post-operative care management.

## Features

- **Brochure Management**: Structured content delivery for post-operative care instructions
- **Patient Tracking**: Log and retrieve patient symptoms, notes, and recovery progress
- **MongoDB Integration**: Optional database persistence (can run without database for MVP)
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Configured for frontend integration

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Brochures
- `GET /brochures` - List all available brochures
- `GET /brochures/myomectomy` - Get myomectomy post-operative care instructions

### Patient Tracking
- `POST /trackers` - Create new patient tracker entry
- `GET /trackers/:patientId` - Get tracker entries for specific patient

## Installation

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `MONGODB_URI` - MongoDB connection string (optional)
- `DATABASE_NAME` - Database name (default: aftercare_db)

## Data Models

### Patient Tracker
```json
{
  "patientId": "string",
  "procedureType": "string",
  "symptoms": ["array of strings"],
  "notes": "string",
  "painLevel": "number (1-10)",
  "medications": ["array of strings"],
  "timestamp": "ISO date string",
  "followUpNeeded": "boolean",
  "warningSignsPresent": "boolean"
}
```

### Brochure Content
```json
{
  "title": "string",
  "lastUpdated": "date string",
  "activityRestrictions": ["array of strings"],
  "painManagement": ["array of strings"],
  "warningSigns": ["array of strings"],
  "followUpSchedule": "object",
  "healingTimeline": "object",
  "dietaryGuidelines": ["array of strings"],
  "incisionCare": ["array of strings"]
}
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

## Database

The application can run with or without MongoDB:
- **With MongoDB**: Full persistence and querying capabilities
- **Without MongoDB**: Basic functionality for MVP testing

## Error Handling

All endpoints return consistent error responses:
```json
{
  "error": true,
  "message": "Error description",
  "timestamp": "ISO date string"
}
```

## CORS Configuration

Configured to accept requests from the frontend application. Update `FRONTEND_URL` in `.env` for different frontend URLs.
