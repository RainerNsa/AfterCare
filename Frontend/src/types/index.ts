// Centralized type definitions for the aftercare application

export interface BrochureData {
  title: string
  lastUpdated: string
  activityRestrictions: string[]
  painManagement: string[]
  warningSigns: string[]
  followUpSchedule: Record<string, string>
  healingTimeline: Record<string, string>
  dietaryGuidelines: string[]
  incisionCare: string[]
}

export interface PatientTracker {
  patientId: string
  procedureType: string
  symptoms: string[]
  notes: string
  painLevel?: number
  medications?: string[]
  timestamp: string
  followUpNeeded?: boolean
  warningSignsPresent?: boolean
}

export interface TodoItem {
  id: string
  text: string
  completed: boolean
  timestamp?: Date
}

export interface SymptomEntry {
  id: string
  symptom: string
  severity: 'mild' | 'moderate' | 'severe'
  timestamp: Date
}

export interface TrackerData {
  todos: TodoItem[]
  symptoms: SymptomEntry[]
  notes: string
  lastUpdated: Date
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp: string
}

export interface ApiError {
  error: string | boolean
  message: string
  details?: string[]
  timestamp: string
}

export type SeverityLevel = 'mild' | 'moderate' | 'severe'

export interface BrochureSectionProps {
  title: string
  items: string[] | Record<string, string>
  type?: 'list' | 'timeline' | 'warning'
  isCollapsible?: boolean
  defaultExpanded?: boolean
}
