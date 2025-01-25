import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { TrackerProvider, useTracker } from '../TrackerContext'
import { createMockFetchResponse } from '../../test/utils'

// Mock the API module
vi.mock('../../services/api', () => ({
  trackerApi: {
    createTrackerEntry: vi.fn()
  },
  handleApiError: vi.fn((error) => error.message || 'Unknown error')
}))

describe('TrackerContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TrackerProvider>{children}</TrackerProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    // Reset navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    })
  })

  describe('Initial State', () => {
    it('provides initial tracker data', () => {
      const { result } = renderHook(() => useTracker(), { wrapper })

      expect(result.current.state.data.todos).toHaveLength(5)
      expect(result.current.state.data.symptoms).toHaveLength(0)
      expect(result.current.state.data.notes).toBe('')
      expect(result.current.state.loading).toBe(false)
      expect(result.current.state.error).toBe(null)
    })

    it('loads data from localStorage if available', () => {
      const savedData = {
        todos: [
          { id: '1', text: 'Test todo', completed: true, timestamp: '2025-01-25T10:00:00Z' }
        ],
        symptoms: [
          {
            id: '1',
            symptom: 'Test symptom',
            severity: 'mild',
            timestamp: '2025-01-25T11:00:00Z'
          }
        ],
        notes: 'Test notes',
        lastUpdated: '2025-01-25T12:00:00Z'
      }

      localStorage.setItem('aftercare-tracker', JSON.stringify(savedData))

      const { result } = renderHook(() => useTracker(), { wrapper })

      expect(result.current.state.data.todos).toHaveLength(1)
      expect(result.current.state.data.todos[0].text).toBe('Test todo')
      expect(result.current.state.data.symptoms).toHaveLength(1)
      expect(result.current.state.data.notes).toBe('Test notes')
    })
  })

  describe('Todo Management', () => {
    it('toggles todo completion status', () => {
      const { result } = renderHook(() => useTracker(), { wrapper })

      const initialTodo = result.current.state.data.todos[0]
      const initialCompleted = initialTodo.completed

      act(() => {
        result.current.toggleTodo(initialTodo.id)
      })

      const updatedTodo = result.current.state.data.todos[0]
      expect(updatedTodo.completed).toBe(!initialCompleted)
      expect(updatedTodo.timestamp).toBeInstanceOf(Date)
    })

    it('updates lastUpdated when todo is toggled', () => {
      const { result } = renderHook(() => useTracker(), { wrapper })

      const initialLastUpdated = result.current.state.data.lastUpdated

      act(() => {
        result.current.toggleTodo(result.current.state.data.todos[0].id)
      })

      expect(result.current.state.data.lastUpdated).not.toEqual(initialLastUpdated)
    })
  })

  describe('Symptom Management', () => {
    it('adds new symptom', () => {
      const { result } = renderHook(() => useTracker(), { wrapper })

      act(() => {
        result.current.addSymptom('Test headache', 'moderate')
      })

      const symptoms = result.current.state.data.symptoms
      expect(symptoms).toHaveLength(1)
      expect(symptoms[0].symptom).toBe('Test headache')
      expect(symptoms[0].severity).toBe('moderate')
      expect(symptoms[0].timestamp).toBeInstanceOf(Date)
    })

    it('adds symptoms to the beginning of the array', () => {
      const { result } = renderHook(() => useTracker(), { wrapper })

      act(() => {
        result.current.addSymptom('First symptom', 'mild')
      })

      act(() => {
        result.current.addSymptom('Second symptom', 'severe')
      })

      const symptoms = result.current.state.data.symptoms
      expect(symptoms[0].symptom).toBe('Second symptom')
      expect(symptoms[1].symptom).toBe('First symptom')
    })
  })

  describe('Notes Management', () => {
    it('updates notes', () => {
      const { result } = renderHook(() => useTracker(), { wrapper })

      act(() => {
        result.current.updateNotes('New notes content')
      })

      expect(result.current.state.data.notes).toBe('New notes content')
    })

    it('updates lastUpdated when notes are changed', () => {
      const { result } = renderHook(() => useTracker(), { wrapper })

      const initialLastUpdated = result.current.state.data.lastUpdated

      act(() => {
        result.current.updateNotes('Updated notes')
      })

      expect(result.current.state.data.lastUpdated).not.toEqual(initialLastUpdated)
    })
  })

  describe('Local Storage Integration', () => {
    it('saves data to localStorage when state changes', () => {
      const { result } = renderHook(() => useTracker(), { wrapper })

      act(() => {
        result.current.updateNotes('Test notes for storage')
      })

      // Check that localStorage.setItem was called
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'aftercare-tracker',
        expect.stringContaining('Test notes for storage')
      )
    })

    it('handles localStorage errors gracefully', () => {
      // Mock localStorage to throw an error
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded')
      })

      const { result } = renderHook(() => useTracker(), { wrapper })

      act(() => {
        result.current.updateNotes('This should trigger storage error')
      })

      // Should not crash and should set error state
      expect(result.current.state.error).toBe('Failed to save data locally')

      // Restore original localStorage
      localStorage.setItem = originalSetItem
    })
  })

  describe('Backend Synchronization', () => {
    it('syncs data with backend successfully', async () => {
      const mockCreateTrackerEntry = vi.fn().mockResolvedValue({
        id: 'test-id',
        patientId: 'test-patient',
        timestamp: new Date().toISOString()
      })

      vi.mocked(await import('../../services/api')).trackerApi.createTrackerEntry = mockCreateTrackerEntry

      const { result } = renderHook(() => useTracker(), { wrapper })

      // Add some data to sync
      act(() => {
        result.current.addSymptom('Test symptom', 'mild')
        result.current.updateNotes('Test notes')
      })

      await act(async () => {
        await result.current.syncWithBackend('test-patient-id')
      })

      expect(mockCreateTrackerEntry).toHaveBeenCalledWith({
        patientId: 'test-patient-id',
        procedureType: 'myomectomy',
        symptoms: ['Test symptom (mild)'],
        notes: 'Test notes',
        followUpNeeded: false,
        warningSignsPresent: false
      })

      expect(result.current.state.lastSyncedWithBackend).toBeInstanceOf(Date)
      expect(result.current.state.error).toBe(null)
    })

    it('handles sync errors gracefully', async () => {
      const mockCreateTrackerEntry = vi.fn().mockRejectedValue(new Error('Network error'))

      vi.mocked(await import('../../services/api')).trackerApi.createTrackerEntry = mockCreateTrackerEntry

      const { result } = renderHook(() => useTracker(), { wrapper })

      await act(async () => {
        await result.current.syncWithBackend('test-patient-id')
      })

      expect(result.current.state.error).toContain('Sync failed')
      expect(result.current.state.lastSyncedWithBackend).toBe(null)
    })

    it('prevents sync when offline', async () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      })

      const { result } = renderHook(() => useTracker(), { wrapper })

      await act(async () => {
        await result.current.syncWithBackend('test-patient-id')
      })

      expect(result.current.state.error).toBe('Cannot sync while offline')
    })

    it('detects severe symptoms for followUpNeeded flag', async () => {
      const mockCreateTrackerEntry = vi.fn().mockResolvedValue({})

      vi.mocked(await import('../../services/api')).trackerApi.createTrackerEntry = mockCreateTrackerEntry

      const { result } = renderHook(() => useTracker(), { wrapper })

      act(() => {
        result.current.addSymptom('Severe pain', 'severe')
      })

      await act(async () => {
        await result.current.syncWithBackend('test-patient-id')
      })

      expect(mockCreateTrackerEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          followUpNeeded: true
        })
      )
    })

    it('detects warning signs for warningSignsPresent flag', async () => {
      const mockCreateTrackerEntry = vi.fn().mockResolvedValue({})

      vi.mocked(await import('../../services/api')).trackerApi.createTrackerEntry = mockCreateTrackerEntry

      const { result } = renderHook(() => useTracker(), { wrapper })

      act(() => {
        result.current.addSymptom('High fever and bleeding', 'moderate')
      })

      await act(async () => {
        await result.current.syncWithBackend('test-patient-id')
      })

      expect(mockCreateTrackerEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          warningSignsPresent: true
        })
      )
    })
  })

  describe('Online/Offline Detection', () => {
    it('handles online event', () => {
      const { result } = renderHook(() => useTracker(), { wrapper })

      // Set initial error
      act(() => {
        result.current.state.error = 'Offline error'
      })

      // Simulate going online
      act(() => {
        window.dispatchEvent(new Event('online'))
      })

      expect(result.current.state.error).toBe(null)
    })

    it('handles offline event', () => {
      const { result } = renderHook(() => useTracker(), { wrapper })

      // Simulate going offline
      act(() => {
        window.dispatchEvent(new Event('offline'))
      })

      expect(result.current.state.error).toBe('You are currently offline. Changes will be saved locally.')
    })
  })

  describe('Error Handling', () => {
    it('throws error when useTracker is used outside provider', () => {
      expect(() => {
        renderHook(() => useTracker())
      }).toThrow('useTracker must be used within a TrackerProvider')
    })
  })
})
