# AfterCare Patient Management System

A comprehensive digital aftercare platform for post-operative patient management, specifically designed for myomectomy recovery tracking.

## 🏥 Overview

This system provides structured post-operative care instructions and interactive recovery tracking for patients recovering from myomectomy surgery. It features real-time symptom monitoring, automatic data synchronization, and offline functionality.

## 🚀 Features

- **Structured Care Instructions**: Evidence-based post-operative guidelines
- **Interactive Recovery Tracking**: Symptom logging with severity levels
- **Real-time Data Sync**: Automatic backup to healthcare provider systems
- **Offline Functionality**: Works without internet connection
- **Mobile Responsive**: Optimized for all devices
- **Accessibility Compliant**: Screen reader compatible

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **UI Library**: Chakra UI
- **Build Tool**: Vite
- **State Management**: React Context
- **Testing**: Vitest + React Testing Library

### Backend (Node.js + Express)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (optional, with in-memory fallback)
- **API**: RESTful endpoints
- **Testing**: Custom test suite

## 📁 Project Structure

```
aftercare/
├── Frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context providers
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript type definitions
│   │   └── test/            # Test utilities and setup
│   └── package.json
├── Backend/                 # Node.js Express API
│   ├── config/             # Database and app configuration
│   ├── data/               # Static data and content
│   ├── models/             # Data models
│   ├── middleware/         # Express middleware
│   ├── test/               # API tests
│   └── package.json
└── Docs/                   # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Backend Setup
```bash
cd Backend
npm install
npm run dev
# Server runs on http://localhost:3000
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
# App runs on http://localhost:5174
```

### Access the Application
- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## 🧪 Testing

### Backend Tests
```bash
cd Backend
npm test
```

### Frontend Tests
```bash
cd Frontend
npm test
```

### Integration Tests
```bash
node test-integration.js
```

## 📊 API Endpoints

### Health & Status
- `GET /health` - Server health check

### Brochure Content
- `GET /brochures` - List available brochures
- `GET /brochures/myomectomy` - Myomectomy care instructions

### Patient Tracking
- `POST /trackers` - Create patient tracker entry
- `GET /trackers/:patientId` - Get patient tracker history

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5174
MONGODB_URI=mongodb://localhost:27017  # Optional
DATABASE_NAME=aftercare_db             # Optional
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3000
```

## 🚀 Deployment

The system is production-ready with:
- Comprehensive error handling
- Security middleware (Helmet, CORS)
- Input validation
- Offline functionality
- Responsive design

## 📈 Development Timeline

This project was developed in phases:
1. **Phase 1**: Backend API setup and content structuring
2. **Phase 2**: Frontend-backend integration
3. **Phase 3**: Testing and validation
4. **Phase 4**: Documentation and deployment preparation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please refer to the documentation in the `/Docs` directory or create an issue in the repository.
