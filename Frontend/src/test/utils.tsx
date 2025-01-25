import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { TrackerProvider } from '../context/TrackerContext'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChakraProvider>
      <TrackerProvider>
        {children}
      </TrackerProvider>
    </ChakraProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Custom render without TrackerProvider (for components that don't need it)
const ChakraOnlyProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  )
}

const renderWithChakra = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: ChakraOnlyProvider, ...options })

// Mock data for tests
export const mockBrochureData = {
  title: "Test Myomectomy Post-Operative Care Instructions",
  lastUpdated: "2025-01-25",
  activityRestrictions: [
    "Lifting: Avoid lifting more than 1 gallon of milk (approximately 8 lbs) for 4-6 weeks",
    "Driving: Restricted until pain medications are discontinued",
    "Exercise: No strenuous exercise or heavy lifting for 4-6 weeks"
  ],
  painManagement: [
    "Take prescribed pain medications as directed by your physician",
    "Use stool softeners if experiencing constipation from pain medications",
    "Apply ice packs to incision area for 15-20 minutes every 2-3 hours"
  ],
  warningSigns: [
    "Fever greater than 100.4°F (38°C)",
    "Heavy bleeding requiring more than one pad per hour",
    "Severe unrelieved abdominal pain"
  ],
  followUpSchedule: {
    "postOpAppointment": "Post-operative appointment scheduled at 4-6 weeks",
    "urgentCare": "Contact office immediately if warning signs occur",
    "routineQuestions": "Call office during business hours for routine questions"
  },
  healingTimeline: {
    "fullRecovery": "Full recovery typically takes 4-6 weeks",
    "dischargeTime": "Hospital discharge usually occurs 4-8 hours after procedure",
    "returnToNormalActivity": "Gradual return to normal activities over 4-6 weeks"
  },
  dietaryGuidelines: [
    "Start with clear liquids and advance to regular diet as tolerated",
    "Increase fiber intake to prevent constipation",
    "Stay well hydrated - drink 8-10 glasses of water daily"
  ],
  incisionCare: [
    "Keep incision clean and dry",
    "Gently wash with soap and water during shower",
    "Pat dry - do not rub the incision area"
  ]
}

export const mockTrackerData = {
  todos: [
    { id: '1', text: 'Avoid lifting more than 1 gallon of milk', completed: false },
    { id: '2', text: 'Take prescribed pain medications as directed', completed: true },
    { id: '3', text: 'Keep incision clean and dry', completed: false }
  ],
  symptoms: [
    {
      id: '1',
      symptom: 'Mild headache',
      severity: 'mild' as const,
      timestamp: new Date('2025-01-25T10:00:00Z')
    },
    {
      id: '2',
      symptom: 'Nausea after medication',
      severity: 'moderate' as const,
      timestamp: new Date('2025-01-25T12:00:00Z')
    }
  ],
  notes: 'Feeling better today. Pain is manageable.',
  lastUpdated: new Date('2025-01-25T14:00:00Z')
}

export const mockApiResponse = {
  success: true,
  data: mockBrochureData,
  timestamp: '2025-01-25T14:00:00Z'
}

export const mockApiError = {
  error: true,
  message: 'Network error occurred',
  timestamp: '2025-01-25T14:00:00Z'
}

// Helper function to create mock fetch responses
export const createMockFetchResponse = (data: any, ok = true, status = 200) => {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
  } as Response)
}

// Helper to wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// re-export everything
export * from '@testing-library/react'
export { customRender as render, renderWithChakra }
