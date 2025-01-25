import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  brochureApi,
  trackerApi,
  healthApi,
  handleApiError,
  checkApiConnectivity
} from '../api'
import { mockBrochureData, mockApiResponse, mockApiError, createMockFetchResponse } from '../../test/utils'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockClear()
  })

  describe('brochureApi', () => {
    describe('getMyomectomyBrochure', () => {
      it('fetches brochure data successfully', async () => {
        mockFetch.mockResolvedValueOnce(createMockFetchResponse(mockApiResponse))

        const result = await brochureApi.getMyomectomyBrochure()

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/brochures/myomectomy',
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json'
            }
          })
        )
        expect(result).toEqual(mockBrochureData)
      })

      it('handles API errors', async () => {
        mockFetch.mockResolvedValueOnce(createMockFetchResponse(mockApiError, false, 500))

        await expect(brochureApi.getMyomectomyBrochure()).rejects.toThrow('Network error occurred')
      })

      it('handles network errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network failure'))

        await expect(brochureApi.getMyomectomyBrochure()).rejects.toThrow('Network failure')
      })
    })

    describe('getBrochuresList', () => {
      it('fetches brochures list successfully', async () => {
        const mockBrochuresList = [
          { id: 'myomectomy', title: 'Myomectomy Care', lastUpdated: '2025-01-25' }
        ]
        const mockResponse = { success: true, data: mockBrochuresList, timestamp: '2025-01-25T14:00:00Z' }

        mockFetch.mockResolvedValueOnce(createMockFetchResponse(mockResponse))

        const result = await brochureApi.getBrochuresList()

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/brochures',
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json'
            }
          })
        )
        expect(result).toEqual(mockBrochuresList)
      })
    })
  })

  describe('trackerApi', () => {
    describe('createTrackerEntry', () => {
      it('creates tracker entry successfully', async () => {
        const mockTrackerData = {
          patientId: 'test-patient',
          procedureType: 'myomectomy',
          symptoms: ['headache'],
          notes: 'feeling better',
          painLevel: 3
        }

        const mockResponse = {
          success: true,
          data: { ...mockTrackerData, timestamp: '2025-01-25T14:00:00Z', _id: 'test-id' },
          timestamp: '2025-01-25T14:00:00Z'
        }

        mockFetch.mockResolvedValueOnce(createMockFetchResponse(mockResponse))

        const result = await trackerApi.createTrackerEntry(mockTrackerData)

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/trackers',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json'
            }),
            body: expect.stringContaining('"patientId":"test-patient"')
          })
        )
        expect(result).toEqual(mockResponse.data)
      })

      it('handles validation errors', async () => {
        const invalidData = {
          patientId: '',
          procedureType: 'myomectomy',
          symptoms: [],
          notes: ''
        }

        const errorResponse = {
          error: 'Validation failed',
          message: 'Invalid tracker data provided',
          details: ['Patient ID is required'],
          timestamp: '2025-01-25T14:00:00Z'
        }

        mockFetch.mockResolvedValueOnce(createMockFetchResponse(errorResponse, false, 400))

        await expect(trackerApi.createTrackerEntry(invalidData)).rejects.toThrow('Invalid tracker data provided')
      })
    })

    describe('getPatientTrackers', () => {
      it('fetches patient trackers successfully', async () => {
        const mockTrackers = [
          {
            patientId: 'test-patient',
            procedureType: 'myomectomy',
            symptoms: ['headache'],
            notes: 'day 1',
            timestamp: '2025-01-25T14:00:00Z'
          }
        ]

        const mockResponse = {
          success: true,
          data: mockTrackers,
          count: 1,
          timestamp: '2025-01-25T14:00:00Z'
        }

        mockFetch.mockResolvedValueOnce(createMockFetchResponse(mockResponse))

        const result = await trackerApi.getPatientTrackers('test-patient')

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/trackers/test-patient?limit=50&offset=0',
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json'
            }
          })
        )
        expect(result).toEqual(mockTrackers)
      })

      it('handles custom limit and offset', async () => {
        const mockResponse = { success: true, data: [], count: 0, timestamp: '2025-01-25T14:00:00Z' }
        mockFetch.mockResolvedValueOnce(createMockFetchResponse(mockResponse))

        await trackerApi.getPatientTrackers('test-patient', { limit: 10, offset: 20 })

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/trackers/test-patient?limit=10&offset=20',
          expect.any(Object)
        )
      })
    })
  })

  describe('healthApi', () => {
    describe('checkHealth', () => {
      it('checks health successfully', async () => {
        const mockHealthResponse = {
          status: 'OK',
          timestamp: '2025-01-25T14:00:00Z',
          service: 'Aftercare Backend API'
        }

        mockFetch.mockResolvedValueOnce(createMockFetchResponse(mockHealthResponse))

        const result = await healthApi.checkHealth()

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/health',
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json'
            }
          })
        )
        expect(result).toEqual(mockHealthResponse)
      })

      it('handles health check failure', async () => {
        mockFetch.mockResolvedValueOnce(createMockFetchResponse(
          { error: 'Service unavailable' },
          false,
          503
        ))

        await expect(healthApi.checkHealth()).rejects.toThrow()
      })
    })
  })

  describe('Error Handling', () => {
    describe('handleApiError', () => {
      it('extracts message from Error objects', () => {
        const error = new Error('Test error message')
        const result = handleApiError(error)
        expect(result).toBe('Test error message')
      })

      it('returns generic message for unknown errors', () => {
        const result = handleApiError('unknown error type')
        expect(result).toBe('An unexpected error occurred')
      })

      it('handles null/undefined errors', () => {
        expect(handleApiError(null)).toBe('An unexpected error occurred')
        expect(handleApiError(undefined)).toBe('An unexpected error occurred')
      })
    })

    describe('checkApiConnectivity', () => {
      it('returns true when health check succeeds', async () => {
        mockFetch.mockResolvedValueOnce(createMockFetchResponse({
          status: 'OK',
          timestamp: '2025-01-25T14:00:00Z',
          service: 'Aftercare Backend API'
        }))

        const result = await checkApiConnectivity()
        expect(result).toBe(true)
      })

      it('returns false when health check fails', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'))

        const result = await checkApiConnectivity()
        expect(result).toBe(false)
      })

      it('returns false when health endpoint returns error', async () => {
        mockFetch.mockResolvedValueOnce(createMockFetchResponse(
          { error: 'Service unavailable' },
          false,
          503
        ))

        const result = await checkApiConnectivity()
        expect(result).toBe(false)
      })
    })
  })

  describe('Request Configuration', () => {
    it('uses correct base URL from environment', async () => {
      // Test with default URL
      mockFetch.mockResolvedValueOnce(createMockFetchResponse({ status: 'OK' }))

      await healthApi.checkHealth()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/health',
        expect.any(Object)
      )
    })

    it('includes proper headers in requests', async () => {
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(mockApiResponse))

      await brochureApi.getMyomectomyBrochure()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
    })

    it('handles custom headers in requests', async () => {
      const mockTrackerData = {
        patientId: 'test-patient',
        procedureType: 'myomectomy',
        symptoms: [],
        notes: ''
      }

      mockFetch.mockResolvedValueOnce(createMockFetchResponse({
        success: true,
        data: mockTrackerData,
        timestamp: '2025-01-25T14:00:00Z'
      }))

      await trackerApi.createTrackerEntry(mockTrackerData)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: expect.any(String)
        })
      )
    })
  })
})
