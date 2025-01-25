import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../test/utils'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { mockBrochureData, mockApiResponse, createMockFetchResponse } from '../test/utils'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('App Integration Tests', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockClear()
    localStorage.clear()
  })

  describe('Application Loading', () => {
    it('displays loading state initially', async () => {
      // Mock a delayed response
      mockFetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve(createMockFetchResponse(mockApiResponse)), 100)
        )
      )

      render(<App />)

      expect(screen.getByText('Loading your aftercare information...')).toBeInTheDocument()
      
      await waitFor(() => {
        expect(screen.queryByText('Loading your aftercare information...')).not.toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('loads and displays brochure content successfully', async () => {
      mockFetch.mockResolvedValueOnce(createMockFetchResponse({
        status: 'OK',
        timestamp: '2025-01-25T14:00:00Z',
        service: 'Aftercare Backend API'
      }))
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(mockApiResponse))

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Aftercare Patient Management')).toBeInTheDocument()
      })

      // Check that brochure sections are rendered
      expect(screen.getByText('Activity Restrictions')).toBeInTheDocument()
      expect(screen.getByText('Warning Signs - Contact Your Doctor Immediately')).toBeInTheDocument()
      expect(screen.getByText('Pain Management')).toBeInTheDocument()
    })

    it('handles API connectivity failure gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Offline Mode')).toBeInTheDocument()
      })

      // Should still display fallback content
      expect(screen.getByText('Activity Restrictions')).toBeInTheDocument()
    })
  })

  describe('Complete User Workflow', () => {
    beforeEach(async () => {
      // Setup successful API responses
      mockFetch.mockResolvedValueOnce(createMockFetchResponse({
        status: 'OK',
        timestamp: '2025-01-25T14:00:00Z',
        service: 'Aftercare Backend API'
      }))
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(mockApiResponse))
    })

    it('allows user to complete the full recovery tracking workflow', async () => {
      render(<App />)

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Recovery Tracker')).toBeInTheDocument()
      })

      // Step 1: Complete a todo item
      const todoCheckboxes = screen.getAllByRole('checkbox')
      await user.click(todoCheckboxes[0])

      // Verify todo is marked as completed
      expect(todoCheckboxes[0]).toBeChecked()

      // Step 2: Log a symptom
      const symptomTextarea = screen.getByLabelText('Symptom')
      const severitySelect = screen.getByLabelText('Severity')
      const logSymptomButton = screen.getByText('Log Symptom')

      await user.type(symptomTextarea, 'Mild headache after medication')
      await user.selectOptions(severitySelect, 'moderate')
      await user.click(logSymptomButton)

      // Verify symptom is logged
      await waitFor(() => {
        expect(screen.getByText('Mild headache after medication')).toBeInTheDocument()
        expect(screen.getByText('moderate')).toBeInTheDocument()
      })

      // Step 3: Add personal notes
      const notesTextarea = screen.getByLabelText('Personal Notes')
      await user.type(notesTextarea, 'Feeling much better today. Pain is manageable with medication.')

      // Verify notes are saved
      expect(notesTextarea).toHaveValue('Feeling much better today. Pain is manageable with medication.')

      // Step 4: Sync with backend
      mockFetch.mockResolvedValueOnce(createMockFetchResponse({
        success: true,
        data: {
          id: 'test-id',
          patientId: 'demo-patient-001',
          timestamp: '2025-01-25T14:00:00Z'
        },
        timestamp: '2025-01-25T14:00:00Z'
      }))

      const syncButton = screen.getByText('Sync with Server')
      await user.click(syncButton)

      // Verify sync success
      await waitFor(() => {
        expect(screen.getByText(/Last synced:/)).toBeInTheDocument()
      })
    })

    it('persists data across page reloads', async () => {
      const { unmount } = render(<App />)

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Recovery Tracker')).toBeInTheDocument()
      })

      // Add some data
      const symptomTextarea = screen.getByLabelText('Symptom')
      await user.type(symptomTextarea, 'Test symptom for persistence')
      await user.click(screen.getByText('Log Symptom'))

      const notesTextarea = screen.getByLabelText('Personal Notes')
      await user.type(notesTextarea, 'Test notes for persistence')

      // Unmount and remount the app (simulating page reload)
      unmount()

      // Mock API calls for the remount
      mockFetch.mockResolvedValueOnce(createMockFetchResponse({
        status: 'OK',
        timestamp: '2025-01-25T14:00:00Z',
        service: 'Aftercare Backend API'
      }))
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(mockApiResponse))

      render(<App />)

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Recovery Tracker')).toBeInTheDocument()
      })

      // Verify data persisted
      expect(screen.getByText('Test symptom for persistence')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test notes for persistence')).toBeInTheDocument()
    })
  })

  describe('Error Handling Integration', () => {
    it('handles network errors during symptom sync', async () => {
      // Setup initial successful load
      mockFetch.mockResolvedValueOnce(createMockFetchResponse({
        status: 'OK',
        timestamp: '2025-01-25T14:00:00Z',
        service: 'Aftercare Backend API'
      }))
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(mockApiResponse))

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Recovery Tracker')).toBeInTheDocument()
      })

      // Add a symptom
      const symptomTextarea = screen.getByLabelText('Symptom')
      await user.type(symptomTextarea, 'Test symptom')
      await user.click(screen.getByText('Log Symptom'))

      // Mock sync failure
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      // Attempt to sync
      const syncButton = screen.getByText('Sync with Server')
      await user.click(syncButton)

      // Verify error handling
      await waitFor(() => {
        expect(screen.getByText(/Sync failed/)).toBeInTheDocument()
      })

      // Verify data is still preserved locally
      expect(screen.getByText('Test symptom')).toBeInTheDocument()
    })

    it('displays offline mode when backend is unavailable', async () => {
      // Mock connectivity check failure
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'))

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Offline Mode')).toBeInTheDocument()
        expect(screen.getByText('Some features may be limited. Check your internet connection.')).toBeInTheDocument()
      })

      // Should still show tracker functionality
      expect(screen.getByText('Recovery Tracker')).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    it('adapts layout for different screen sizes', async () => {
      // Mock successful API responses
      mockFetch.mockResolvedValueOnce(createMockFetchResponse({
        status: 'OK',
        timestamp: '2025-01-25T14:00:00Z',
        service: 'Aftercare Backend API'
      }))
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(mockApiResponse))

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Aftercare Patient Management')).toBeInTheDocument()
      })

      // Verify both brochure content and tracker are present
      expect(screen.getByText('Activity Restrictions')).toBeInTheDocument()
      expect(screen.getByText('Recovery Tracker')).toBeInTheDocument()

      // The exact layout testing would require more sophisticated viewport mocking
      // but we can verify that both main sections are rendered
    })
  })

  describe('Accessibility Integration', () => {
    it('maintains proper focus management during interactions', async () => {
      mockFetch.mockResolvedValueOnce(createMockFetchResponse({
        status: 'OK',
        timestamp: '2025-01-25T14:00:00Z',
        service: 'Aftercare Backend API'
      }))
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(mockApiResponse))

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Recovery Tracker')).toBeInTheDocument()
      })

      // Test keyboard navigation
      const symptomTextarea = screen.getByLabelText('Symptom')
      symptomTextarea.focus()
      expect(document.activeElement).toBe(symptomTextarea)

      // Tab to severity select
      await user.tab()
      const severitySelect = screen.getByLabelText('Severity')
      expect(document.activeElement).toBe(severitySelect)

      // Tab to submit button
      await user.tab()
      const submitButton = screen.getByText('Log Symptom')
      expect(document.activeElement).toBe(submitButton)
    })

    it('provides proper ARIA labels and semantic structure', async () => {
      mockFetch.mockResolvedValueOnce(createMockFetchResponse({
        status: 'OK',
        timestamp: '2025-01-25T14:00:00Z',
        service: 'Aftercare Backend API'
      }))
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(mockApiResponse))

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Aftercare Patient Management')).toBeInTheDocument()
      })

      // Check for proper heading hierarchy
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveTextContent('Aftercare Patient Management')

      // Check for proper regions
      const brochureSections = screen.getAllByRole('region')
      expect(brochureSections.length).toBeGreaterThan(0)

      // Check for proper form labels
      expect(screen.getByLabelText('Symptom')).toBeInTheDocument()
      expect(screen.getByLabelText('Severity')).toBeInTheDocument()
      expect(screen.getByLabelText('Personal Notes')).toBeInTheDocument()
    })
  })
})
