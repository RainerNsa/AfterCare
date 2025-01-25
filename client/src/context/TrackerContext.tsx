import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { trackerApi, handleApiError } from '../services/api'
import type { TrackerData, TodoItem, SymptomEntry, PatientTracker } from '../types'

// Enhanced action types for the reducer
type TrackerAction =
  | { type: 'SET_TRACKER_DATA'; payload: TrackerData }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'ADD_SYMPTOM'; payload: SymptomEntry }
  | { type: 'UPDATE_NOTES'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SYNC_WITH_BACKEND'; payload: boolean }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_ONBOARDING_COMPLETE'; payload: boolean }
  | { type: 'RESET_TRACKER'; payload: TrackerData }
  | { type: 'BULK_UPDATE_TODOS'; payload: { ids: string[]; completed: boolean } }
  | { type: 'DELETE_SYMPTOM'; payload: string }
  | { type: 'UPDATE_SYMPTOM'; payload: { id: string; symptom: Partial<SymptomEntry> } }

// Enhanced state interface with new features
interface TrackerState {
  data: TrackerData
  loading: boolean
  error: string | null
  lastSyncedWithBackend: Date | null
  isOnline: boolean
  progress: number
  onboardingComplete: boolean
  totalTasks: number
  completedTasks: number
}

// Enhanced context interface with new methods
interface TrackerContextType {
  state: TrackerState
  toggleTodo: (todoId: string) => void
  addSymptom: (symptom: string, severity: 'mild' | 'moderate' | 'severe') => void
  updateNotes: (notes: string) => void
  syncWithBackend: (patientId: string) => Promise<void>
  loadFromLocalStorage: () => void
  saveToLocalStorage: () => void
  exportToPDF: () => Promise<void>
  resetTracker: () => void
  bulkUpdateTodos: (ids: string[], completed: boolean) => void
  deleteSymptom: (id: string) => void
  updateSymptom: (id: string, updates: Partial<SymptomEntry>) => void
  completeOnboarding: () => void
  calculateProgress: () => number
}

// Initial state
const initialTrackerData: TrackerData = {
  todos: [
    { id: '1', text: 'Avoid lifting more than 1 gallon of milk', completed: false },
    { id: '2', text: 'Take prescribed pain medications as directed', completed: false },
    { id: '3', text: 'Keep incision clean and dry', completed: false },
    { id: '4', text: 'Attend follow-up appointment', completed: false },
    { id: '5', text: 'Stay well hydrated (8-10 glasses of water daily)', completed: false }
  ],
  symptoms: [],
  notes: '',
  lastUpdated: new Date()
}

const initialState: TrackerState = {
  data: initialTrackerData,
  loading: false,
  error: null,
  lastSyncedWithBackend: null,
  isOnline: navigator.onLine,
  progress: 0,
  onboardingComplete: localStorage.getItem('aftercare-onboarding-complete') === 'true',
  totalTasks: initialTrackerData.todos.length,
  completedTasks: 0
}

// Reducer function
function trackerReducer(state: TrackerState, action: TrackerAction): TrackerState {
  switch (action.type) {
    case 'SET_TRACKER_DATA':
      return {
        ...state,
        data: action.payload,
        error: null
      }
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        data: {
          ...state.data,
          todos: state.data.todos.map(todo =>
            todo.id === action.payload
              ? { ...todo, completed: !todo.completed, timestamp: new Date() }
              : todo
          ),
          lastUpdated: new Date()
        }
      }
    
    case 'ADD_SYMPTOM':
      return {
        ...state,
        data: {
          ...state.data,
          symptoms: [action.payload, ...state.data.symptoms],
          lastUpdated: new Date()
        }
      }
    
    case 'UPDATE_NOTES':
      return {
        ...state,
        data: {
          ...state.data,
          notes: action.payload,
          lastUpdated: new Date()
        }
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }
    
    case 'SYNC_WITH_BACKEND':
      return {
        ...state,
        lastSyncedWithBackend: action.payload ? new Date() : null
      }

    case 'SET_PROGRESS':
      return {
        ...state,
        progress: action.payload
      }

    case 'SET_ONBOARDING_COMPLETE':
      return {
        ...state,
        onboardingComplete: action.payload
      }

    case 'RESET_TRACKER':
      return {
        ...state,
        data: action.payload,
        progress: 0,
        completedTasks: 0
      }

    case 'BULK_UPDATE_TODOS':
      return {
        ...state,
        data: {
          ...state.data,
          todos: state.data.todos.map(todo =>
            action.payload.ids.includes(todo.id)
              ? { ...todo, completed: action.payload.completed, timestamp: new Date() }
              : todo
          ),
          lastUpdated: new Date()
        }
      }

    case 'DELETE_SYMPTOM':
      return {
        ...state,
        data: {
          ...state.data,
          symptoms: state.data.symptoms.filter(symptom => symptom.id !== action.payload),
          lastUpdated: new Date()
        }
      }

    case 'UPDATE_SYMPTOM':
      return {
        ...state,
        data: {
          ...state.data,
          symptoms: state.data.symptoms.map(symptom =>
            symptom.id === action.payload.id
              ? { ...symptom, ...action.payload.symptom, timestamp: new Date() }
              : symptom
          ),
          lastUpdated: new Date()
        }
      }

    default:
      return state
  }
}

// Create context
const TrackerContext = createContext<TrackerContextType | undefined>(undefined)

// Provider component
interface TrackerProviderProps {
  children: ReactNode
}

export const TrackerProvider: React.FC<TrackerProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(trackerReducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage()
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToLocalStorage()
  }, [state.data])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      dispatch({ type: 'SET_ERROR', payload: null })
    }

    const handleOffline = () => {
      dispatch({ type: 'SET_ERROR', payload: 'You are currently offline. Changes will be saved locally.' })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('aftercare-tracker')
      if (savedData) {
        const parsed = JSON.parse(savedData)
        const trackerData: TrackerData = {
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated),
          symptoms: parsed.symptoms.map((s: any) => ({
            ...s,
            timestamp: new Date(s.timestamp)
          }))
        }
        dispatch({ type: 'SET_TRACKER_DATA', payload: trackerData })
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved data' })
    }
  }

  const saveToLocalStorage = () => {
    try {
      // Enhanced localStorage with metadata
      const dataToSave = {
        ...state.data,
        metadata: {
          version: '1.0.0',
          lastSaved: new Date().toISOString(),
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
          }
        }
      }

      localStorage.setItem('aftercare-tracker', JSON.stringify(dataToSave))

      // Also save progress data separately for quick access
      localStorage.setItem('aftercare-progress', JSON.stringify({
        progress: state.progress,
        totalTasks: state.totalTasks,
        completedTasks: state.completedTasks,
        lastUpdated: new Date().toISOString()
      }))

    } catch (error) {
      console.error('Error saving to localStorage:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save data locally' })
    }
  }

  const toggleTodo = (todoId: string) => {
    dispatch({ type: 'TOGGLE_TODO', payload: todoId })
  }

  const addSymptom = (symptom: string, severity: 'mild' | 'moderate' | 'severe') => {
    const symptomEntry: SymptomEntry = {
      id: Date.now().toString(),
      symptom: symptom.trim(),
      severity,
      timestamp: new Date()
    }
    dispatch({ type: 'ADD_SYMPTOM', payload: symptomEntry })
  }

  const updateNotes = (notes: string) => {
    dispatch({ type: 'UPDATE_NOTES', payload: notes })
  }

  const syncWithBackend = async (patientId: string) => {
    if (!navigator.onLine) {
      dispatch({ type: 'SET_ERROR', payload: 'Cannot sync while offline' })
      return
    }

    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Prepare data for backend
      const trackerPayload: Omit<PatientTracker, 'timestamp'> = {
        patientId,
        procedureType: 'myomectomy',
        symptoms: state.data.symptoms.map(s => `${s.symptom} (${s.severity})`),
        notes: state.data.notes,
        followUpNeeded: state.data.symptoms.some(s => s.severity === 'severe'),
        warningSignsPresent: state.data.symptoms.some(s => 
          s.symptom.toLowerCase().includes('fever') ||
          s.symptom.toLowerCase().includes('bleeding') ||
          s.symptom.toLowerCase().includes('pain')
        )
      }

      await trackerApi.createTrackerEntry(trackerPayload)
      dispatch({ type: 'SYNC_WITH_BACKEND', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
    } catch (error) {
      const errorMessage = handleApiError(error)
      dispatch({ type: 'SET_ERROR', payload: `Sync failed: ${errorMessage}` })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // New enhanced methods
  const exportToPDF = async () => {
    const { exportTrackerToPDF } = await import('../utils/pdfExport')
    const progressData = {
      progress: calculateProgress(),
      totalTasks: state.totalTasks,
      completedTasks: state.completedTasks
    }

    await exportTrackerToPDF(state.data, {
      procedureType: 'Myomectomy Recovery',
      patientName: 'Patient' // Could be enhanced with actual patient data
    })
  }

  const resetTracker = () => {
    dispatch({ type: 'RESET_TRACKER', payload: initialTrackerData })
  }

  const bulkUpdateTodos = (ids: string[], completed: boolean) => {
    dispatch({ type: 'BULK_UPDATE_TODOS', payload: { ids, completed } })
  }

  const deleteSymptom = (id: string) => {
    dispatch({ type: 'DELETE_SYMPTOM', payload: id })
  }

  const updateSymptom = (id: string, updates: Partial<SymptomEntry>) => {
    dispatch({ type: 'UPDATE_SYMPTOM', payload: { id, symptom: updates } })
  }

  const completeOnboarding = () => {
    localStorage.setItem('aftercare-onboarding-complete', 'true')
    dispatch({ type: 'SET_ONBOARDING_COMPLETE', payload: true })
  }

  const calculateProgress = (): number => {
    const completedTodos = state.data.todos.filter(todo => todo.completed).length
    const totalTodos = state.data.todos.length
    const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0

    // Update progress in state
    dispatch({ type: 'SET_PROGRESS', payload: progress })

    return progress
  }

  // Calculate progress whenever todos change
  useEffect(() => {
    calculateProgress()
  }, [state.data.todos])

  const contextValue: TrackerContextType = {
    state,
    toggleTodo,
    addSymptom,
    updateNotes,
    syncWithBackend,
    loadFromLocalStorage,
    saveToLocalStorage,
    exportToPDF,
    resetTracker,
    bulkUpdateTodos,
    deleteSymptom,
    updateSymptom,
    completeOnboarding,
    calculateProgress
  }

  return (
    <TrackerContext.Provider value={contextValue}>
      {children}
    </TrackerContext.Provider>
  )
}

// Custom hook to use the tracker context
export const useTracker = (): TrackerContextType => {
  const context = useContext(TrackerContext)
  if (context === undefined) {
    throw new Error('useTracker must be used within a TrackerProvider')
  }
  return context
}

export default TrackerContext
