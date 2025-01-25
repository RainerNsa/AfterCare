// API service functions for communicating with the backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Types based on backend models
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

// Generic API request function with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error)
    throw error
  }
}

// Brochure API functions
export const brochureApi = {
  /**
   * Fetch myomectomy brochure content
   */
  async getMyomectomyBrochure(): Promise<BrochureData> {
    const response = await apiRequest<ApiResponse<BrochureData>>('/brochures/myomectomy')
    return response.data
  },

  /**
   * Fetch list of available brochures
   */
  async getBrochuresList(): Promise<Array<{ id: string; title: string; lastUpdated: string }>> {
    const response = await apiRequest<ApiResponse<Array<{ id: string; title: string; lastUpdated: string }>>>('/brochures')
    return response.data
  }
}

// Patient Tracker API functions
export const trackerApi = {
  /**
   * Create a new patient tracker entry
   */
  async createTrackerEntry(trackerData: Omit<PatientTracker, 'timestamp'>): Promise<PatientTracker> {
    const response = await apiRequest<ApiResponse<PatientTracker>>('/trackers', {
      method: 'POST',
      body: JSON.stringify({
        ...trackerData,
        timestamp: new Date().toISOString()
      })
    })
    return response.data
  },

  /**
   * Get tracker entries for a specific patient
   */
  async getPatientTrackers(
    patientId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<PatientTracker[]> {
    const { limit = 50, offset = 0 } = options
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    })
    
    const response = await apiRequest<ApiResponse<PatientTracker[]>>(
      `/trackers/${patientId}?${queryParams}`
    )
    return response.data
  }
}

// Health check function
export const healthApi = {
  /**
   * Check if the backend API is healthy
   */
  async checkHealth(): Promise<{ status: string; timestamp: string; service: string }> {
    return await apiRequest('/health')
  }
}

// Utility function to handle API errors in components
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// Hook-like function for checking API connectivity
export async function checkApiConnectivity(): Promise<boolean> {
  try {
    await healthApi.checkHealth()
    return true
  } catch (error) {
    console.warn('API connectivity check failed:', error)
    return false
  }
}

export default {
  brochureApi,
  trackerApi,
  healthApi,
  handleApiError,
  checkApiConnectivity
}
