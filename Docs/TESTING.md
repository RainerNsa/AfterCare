# Testing Documentation

This document outlines the comprehensive testing strategy implemented for the Aftercare Frontend application.

## Testing Infrastructure

### Setup
- **Testing Framework**: Vitest (fast, modern testing framework)
- **React Testing**: @testing-library/react for component testing
- **DOM Testing**: @testing-library/jest-dom for DOM assertions
- **User Interactions**: @testing-library/user-event for realistic user interactions
- **Environment**: jsdom for browser-like testing environment

### Configuration
- **Test Files**: Located in `__tests__` directories alongside source files
- **Setup File**: `src/test/setup.ts` configures global test environment
- **Utilities**: `src/test/utils.tsx` provides custom render functions and mock data

## Test Coverage

### 1. Component Tests

#### BrochureSection Component (`src/components/__tests__/BrochureSection.test.tsx`)
**Coverage**: 17 test cases across 7 test suites

- **Basic Rendering**: Verifies component renders with different content types
- **Accessibility Features**: Tests ARIA labels, semantic HTML, and screen reader support
- **Display Types**: Tests list, timeline, and warning display modes
- **Warning Styling**: Verifies special styling for warning content
- **Collapsible Functionality**: Tests accordion behavior when enabled
- **Empty Content Handling**: Ensures graceful handling of empty data
- **Content Formatting**: Tests camelCase to readable text conversion

**Key Features Tested**:
- ✅ Proper ARIA labeling for accessibility
- ✅ Semantic HTML structure with headings and lists
- ✅ Different content display types (list, timeline, warning)
- ✅ Warning badges for critical information
- ✅ Responsive collapsible sections
- ✅ Empty state handling

#### InteractiveTracker Component (`src/components/__tests__/InteractiveTracker.test.tsx`)
**Coverage**: 25+ test cases across 8 test suites

- **Basic Rendering**: Tests all major sections render correctly
- **Todo Functionality**: Tests checkbox interactions and state management
- **Symptom Logging**: Tests form inputs, validation, and submission
- **Notes Functionality**: Tests textarea updates and persistence
- **Sync Functionality**: Tests backend synchronization
- **Error Handling**: Tests error states and user feedback
- **Status Information**: Tests timestamp displays and sync status
- **Accessibility**: Tests form labels and heading hierarchy

**Key Features Tested**:
- ✅ Todo item completion tracking
- ✅ Symptom logging with severity levels
- ✅ Personal notes functionality
- ✅ Backend synchronization
- ✅ Loading and error states
- ✅ Accessibility compliance

### 2. Context Tests

#### TrackerContext (`src/context/__tests__/TrackerContext.test.tsx`)
**Coverage**: 18 test cases across 7 test suites

- **Initial State**: Tests default state and localStorage loading
- **Todo Management**: Tests todo toggle functionality
- **Symptom Management**: Tests symptom addition and ordering
- **Notes Management**: Tests notes updates and timestamps
- **Local Storage Integration**: Tests data persistence
- **Backend Synchronization**: Tests API integration and error handling
- **Online/Offline Detection**: Tests connectivity state management

**Key Features Tested**:
- ✅ State management with useReducer
- ✅ Local storage persistence
- ✅ Backend API integration
- ✅ Online/offline detection
- ✅ Error handling and recovery
- ✅ Data validation and transformation

### 3. API Service Tests

#### API Services (`src/services/__tests__/api.test.ts`)
**Coverage**: 20+ test cases across 6 test suites

- **Brochure API**: Tests content fetching and error handling
- **Tracker API**: Tests CRUD operations for patient data
- **Health API**: Tests connectivity checking
- **Error Handling**: Tests various error scenarios
- **Request Configuration**: Tests proper headers and URL construction

**Key Features Tested**:
- ✅ RESTful API communication
- ✅ Error handling and recovery
- ✅ Request/response validation
- ✅ Network connectivity checking
- ✅ Proper HTTP headers and methods

### 4. Integration Tests

#### App Integration (`src/__tests__/App.integration.test.tsx`)
**Coverage**: 10+ test cases across 5 test suites

- **Application Loading**: Tests initial load states and API integration
- **Complete User Workflow**: Tests end-to-end user interactions
- **Error Handling Integration**: Tests error scenarios across components
- **Responsive Behavior**: Tests layout adaptation
- **Accessibility Integration**: Tests keyboard navigation and ARIA compliance

**Key Features Tested**:
- ✅ Complete user workflow from loading to data sync
- ✅ Cross-component data flow
- ✅ Error handling across the application
- ✅ Accessibility compliance
- ✅ Responsive design behavior

## Test Utilities and Mocks

### Custom Render Functions
```typescript
// Renders components with all necessary providers
render(<Component />)

// Renders with only Chakra UI provider (for isolated component tests)
renderWithChakra(<Component />)
```

### Mock Data
- **mockBrochureData**: Complete brochure content for testing
- **mockTrackerData**: Sample tracker data with todos, symptoms, and notes
- **mockApiResponse**: Standardized API response format
- **mockApiError**: Error response format

### Global Mocks
- **localStorage**: Mocked for testing data persistence
- **fetch**: Mocked for API testing
- **navigator.onLine**: Mocked for connectivity testing
- **ResizeObserver**: Mocked for responsive testing

## Running Tests

### Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- src/components/__tests__/BrochureSection.test.tsx

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Scripts
- `npm test`: Run all tests once
- `npm run test:ui`: Launch Vitest UI for interactive testing
- `npm run test:coverage`: Generate coverage reports

## Testing Best Practices

### 1. Test Structure
- **Arrange**: Set up test data and mocks
- **Act**: Perform the action being tested
- **Assert**: Verify the expected outcome

### 2. User-Centric Testing
- Test from the user's perspective
- Use semantic queries (getByRole, getByLabelText)
- Test user interactions, not implementation details

### 3. Accessibility Testing
- Verify ARIA labels and roles
- Test keyboard navigation
- Ensure proper heading hierarchy
- Test screen reader compatibility

### 4. Error Handling
- Test both success and failure scenarios
- Verify error messages are user-friendly
- Test graceful degradation

### 5. Async Testing
- Use waitFor for async operations
- Test loading states
- Handle promise rejections properly

## Known Issues and Limitations

### Chakra UI v3 Compatibility
Some tests may fail due to Chakra UI v3 API changes:
- `useColorModeValue` hook not available
- `useToast` hook API changes
- Component prop changes

### Recommended Fixes
1. Update to Chakra UI v3 compatible test utilities
2. Mock Chakra UI hooks in test setup
3. Use CSS-in-JS testing strategies for theme testing

## Future Improvements

### 1. Visual Regression Testing
- Add screenshot testing with tools like Playwright
- Test responsive breakpoints visually

### 2. Performance Testing
- Add performance benchmarks
- Test component render times
- Memory leak detection

### 3. E2E Testing
- Add Cypress or Playwright for full browser testing
- Test complete user journeys
- Cross-browser compatibility testing

### 4. Accessibility Automation
- Integrate axe-core for automated accessibility testing
- Add color contrast testing
- Test with actual screen readers

## Conclusion

The testing suite provides comprehensive coverage of:
- ✅ Component functionality and rendering
- ✅ User interactions and workflows
- ✅ State management and data persistence
- ✅ API integration and error handling
- ✅ Accessibility compliance
- ✅ Responsive behavior

This ensures the Aftercare application is reliable, accessible, and user-friendly across different scenarios and edge cases.
