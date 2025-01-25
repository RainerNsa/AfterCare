import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/utils'
import userEvent from '@testing-library/user-event'
import InteractiveTracker from '../InteractiveTracker'

// Mock the useTracker hook
const mockToggleTodo = vi.fn()
const mockAddSymptom = vi.fn()
const mockUpdateNotes = vi.fn()
const mockSyncWithBackend = vi.fn().mockResolvedValue(undefined)

const mockTrackerState = {
  data: {
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
  },
  loading: false,
  error: null,
  lastSyncedWithBackend: null,
  isOnline: true
}

vi.mock('../../context/TrackerContext', () => ({
  useTracker: () => ({
    state: mockTrackerState,
    toggleTodo: mockToggleTodo,
    addSymptom: mockAddSymptom,
    updateNotes: mockUpdateNotes,
    syncWithBackend: mockSyncWithBackend
  })
}))

describe('InteractiveTracker', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders the recovery tracker heading', () => {
      render(<InteractiveTracker />)
      expect(screen.getByText('Recovery Tracker')).toBeInTheDocument()
    })

    it('renders sync button', () => {
      render(<InteractiveTracker />)
      expect(screen.getByText('Sync with Server')).toBeInTheDocument()
    })

    it('renders daily care tasks section', () => {
      render(<InteractiveTracker />)
      expect(screen.getByText('Daily Care Tasks')).toBeInTheDocument()
    })

    it('renders symptom tracker section', () => {
      render(<InteractiveTracker />)
      expect(screen.getByText('Symptom Tracker')).toBeInTheDocument()
    })

    it('renders personal notes section', () => {
      render(<InteractiveTracker />)
      expect(screen.getByText('Personal Notes')).toBeInTheDocument()
    })
  })

  describe('Todo Functionality', () => {
    it('displays all todo items', () => {
      render(<InteractiveTracker />)
      
      expect(screen.getByText('Avoid lifting more than 1 gallon of milk')).toBeInTheDocument()
      expect(screen.getByText('Take prescribed pain medications as directed')).toBeInTheDocument()
      expect(screen.getByText('Keep incision clean and dry')).toBeInTheDocument()
    })

    it('shows completed todos with line-through styling', () => {
      render(<InteractiveTracker />)
      
      const completedTodo = screen.getByText('Take prescribed pain medications as directed')
      expect(completedTodo).toHaveStyle({ textDecoration: 'line-through' })
    })

    it('calls toggleTodo when checkbox is clicked', async () => {
      render(<InteractiveTracker />)
      
      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[0])
      
      expect(mockToggleTodo).toHaveBeenCalledWith('1')
    })

    it('shows correct checkbox states', () => {
      render(<InteractiveTracker />)
      
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes[0]).not.toBeChecked() // First todo is not completed
      expect(checkboxes[1]).toBeChecked() // Second todo is completed
      expect(checkboxes[2]).not.toBeChecked() // Third todo is not completed
    })
  })

  describe('Symptom Logging', () => {
    it('renders symptom input form', () => {
      render(<InteractiveTracker />)
      
      expect(screen.getByLabelText('Symptom')).toBeInTheDocument()
      expect(screen.getByLabelText('Severity')).toBeInTheDocument()
      expect(screen.getByText('Log Symptom')).toBeInTheDocument()
    })

    it('allows typing in symptom textarea', async () => {
      render(<InteractiveTracker />)
      
      const textarea = screen.getByLabelText('Symptom')
      await user.type(textarea, 'New symptom description')
      
      expect(textarea).toHaveValue('New symptom description')
    })

    it('allows selecting severity level', async () => {
      render(<InteractiveTracker />)
      
      const select = screen.getByLabelText('Severity')
      await user.selectOptions(select, 'severe')
      
      expect(select).toHaveValue('severe')
    })

    it('calls addSymptom when form is submitted', async () => {
      render(<InteractiveTracker />)
      
      const textarea = screen.getByLabelText('Symptom')
      const select = screen.getByLabelText('Severity')
      const button = screen.getByText('Log Symptom')
      
      await user.type(textarea, 'Test symptom')
      await user.selectOptions(select, 'moderate')
      await user.click(button)
      
      expect(mockAddSymptom).toHaveBeenCalledWith('Test symptom', 'moderate')
    })

    it('disables submit button when symptom is empty', () => {
      render(<InteractiveTracker />)
      
      const button = screen.getByText('Log Symptom')
      expect(button).toBeDisabled()
    })

    it('displays recent symptoms', () => {
      render(<InteractiveTracker />)
      
      expect(screen.getByText('Recent Symptoms:')).toBeInTheDocument()
      expect(screen.getByText('Mild headache')).toBeInTheDocument()
      expect(screen.getByText('Nausea after medication')).toBeInTheDocument()
    })

    it('shows severity badges for symptoms', () => {
      render(<InteractiveTracker />)
      
      expect(screen.getByText('mild')).toBeInTheDocument()
      expect(screen.getByText('moderate')).toBeInTheDocument()
    })
  })

  describe('Notes Functionality', () => {
    it('displays current notes', () => {
      render(<InteractiveTracker />)
      
      const notesTextarea = screen.getByDisplayValue('Feeling better today. Pain is manageable.')
      expect(notesTextarea).toBeInTheDocument()
    })

    it('calls updateNotes when notes are changed', async () => {
      render(<InteractiveTracker />)
      
      const notesTextarea = screen.getByDisplayValue('Feeling better today. Pain is manageable.')
      await user.clear(notesTextarea)
      await user.type(notesTextarea, 'Updated notes')
      
      expect(mockUpdateNotes).toHaveBeenCalledWith('Updated notes')
    })
  })

  describe('Sync Functionality', () => {
    it('calls syncWithBackend when sync button is clicked', async () => {
      render(<InteractiveTracker />)
      
      const syncButton = screen.getByText('Sync with Server')
      await user.click(syncButton)
      
      expect(mockSyncWithBackend).toHaveBeenCalledWith('demo-patient-001')
    })

    it('shows loading state during sync', () => {
      const loadingState = {
        ...mockTrackerState,
        loading: true
      }
      
      vi.mocked(vi.importActual('../../context/TrackerContext')).useTracker = () => ({
        state: loadingState,
        toggleTodo: mockToggleTodo,
        addSymptom: mockAddSymptom,
        updateNotes: mockUpdateNotes,
        syncWithBackend: mockSyncWithBackend
      })
      
      render(<InteractiveTracker />)
      
      expect(screen.getByText('Syncing...')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('displays error message when present', () => {
      const errorState = {
        ...mockTrackerState,
        error: 'Network connection failed'
      }
      
      vi.mocked(vi.importActual('../../context/TrackerContext')).useTracker = () => ({
        state: errorState,
        toggleTodo: mockToggleTodo,
        addSymptom: mockAddSymptom,
        updateNotes: mockUpdateNotes,
        syncWithBackend: mockSyncWithBackend
      })
      
      render(<InteractiveTracker />)
      
      expect(screen.getByText('Network connection failed')).toBeInTheDocument()
    })
  })

  describe('Status Information', () => {
    it('displays last updated timestamp', () => {
      render(<InteractiveTracker />)
      
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument()
    })

    it('displays last synced timestamp when available', () => {
      const syncedState = {
        ...mockTrackerState,
        lastSyncedWithBackend: new Date('2025-01-25T15:00:00Z')
      }
      
      vi.mocked(vi.importActual('../../context/TrackerContext')).useTracker = () => ({
        state: syncedState,
        toggleTodo: mockToggleTodo,
        addSymptom: mockAddSymptom,
        updateNotes: mockUpdateNotes,
        syncWithBackend: mockSyncWithBackend
      })
      
      render(<InteractiveTracker />)
      
      expect(screen.getByText(/Last synced:/)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(<InteractiveTracker />)
      
      expect(screen.getByLabelText('Symptom')).toBeInTheDocument()
      expect(screen.getByLabelText('Severity')).toBeInTheDocument()
      expect(screen.getByLabelText('Personal Notes')).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<InteractiveTracker />)
      
      const mainHeading = screen.getByRole('heading', { level: 3, name: 'Recovery Tracker' })
      expect(mainHeading).toBeInTheDocument()
      
      const subHeadings = screen.getAllByRole('heading', { level: 4 })
      expect(subHeadings).toHaveLength(2) // Daily Care Tasks and Symptom Tracker
    })
  })
})
