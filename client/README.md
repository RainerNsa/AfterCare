# Aftercare Frontend - React + Chakra UI

A responsive React application for post-operative patient care management, built with TypeScript and Chakra UI.

## Features

### 🏥 **Brochure Content Display**
- **BrochureSection Component**: Displays structured aftercare instructions
- **Responsive Layout**: Adapts to mobile and desktop screens
- **Accessibility**: WCAG 2.1 compliant with proper ARIA labels
- **Content Types**: Activity restrictions, pain management, warning signs, etc.

### 📊 **Interactive Recovery Tracker**
- **To-Do Checklists**: Track daily care tasks with checkboxes
- **Symptom Logging**: Record symptoms with severity levels (mild/moderate/severe)
- **Personal Notes**: Journal functionality for recovery progress
- **Local Storage**: Automatic data persistence across sessions
- **Backend Sync**: Optional synchronization with server

### 🎨 **UI/UX Features**
- **Chakra UI Components**: Modern, accessible component library
- **Responsive Grid**: Mobile-first design with desktop optimization
- **Custom Theme**: Medical-focused color scheme and typography
- **Toast Notifications**: User feedback for actions
- **Loading States**: Smooth user experience with spinners and loading indicators

### 🔄 **State Management**
- **React Context**: Centralized state management for tracker data
- **Local Storage Integration**: Automatic data persistence
- **API Integration**: RESTful communication with backend
- **Offline Support**: Graceful degradation when backend is unavailable

## Getting Started

### Prerequisites
- Node.js (v20.19.0 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Create .env file
   echo "VITE_API_URL=http://localhost:3000" > .env
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

### Backend Integration

To enable full functionality, ensure the backend API is running:

```bash
# In a separate terminal, navigate to Backend directory
cd ../Backend
npm run dev
```

The frontend will automatically detect backend availability and switch between online/offline modes.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── BrochureSection.tsx    # Content display component
│   └── InteractiveTracker.tsx # Recovery tracking component
├── context/             # React Context providers
│   └── TrackerContext.tsx    # State management for tracker data
├── services/            # API integration layer
│   └── api.ts               # Backend communication functions
├── types/               # TypeScript type definitions
│   └── index.ts             # Centralized type exports
├── theme/               # Chakra UI theme customization
│   └── index.ts             # Custom theme configuration
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Key Components

### BrochureSection
Displays structured aftercare content with support for:
- List format (activity restrictions, dietary guidelines)
- Timeline format (healing schedule, follow-up appointments)
- Warning format (emergency signs with visual emphasis)

### InteractiveTracker
Provides patient interaction features:
- Checkbox to-do lists for daily care tasks
- Symptom logging with severity tracking
- Note-taking functionality
- Data synchronization with backend

### TrackerContext
Manages application state with:
- Local storage persistence
- Backend synchronization
- Offline/online mode handling
- Error state management

## API Integration

The frontend communicates with the backend through:

- **GET /brochures/myomectomy** - Fetch post-operative care instructions
- **POST /trackers** - Save patient tracker data
- **GET /trackers/:patientId** - Retrieve patient history
- **GET /health** - Check backend connectivity

## Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG 2.1 AA compliant color schemes
- **Semantic HTML**: Proper heading hierarchy and landmarks

## Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoint System**: Chakra UI's responsive utilities
- **Grid Layout**: Flexible layout that adapts to screen size
- **Touch Friendly**: Appropriate touch targets for mobile

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style and patterns
2. Ensure accessibility compliance
3. Test on multiple screen sizes
4. Update documentation for new features
