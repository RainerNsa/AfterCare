// Integration tests for Frontend-Backend communication
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { brochureApi, trackerApi, healthApi, checkApiConnectivity } from '../services/api'

describe('Frontend-Backend Integration', () => {
  beforeAll(async () => {
    // Wait a moment for services to be ready
    await new Promise(resolve => setTimeout(resolve, 1000))
  })

  describe('API Connectivity', () => {
    it('should connect to the backend health endpoint', async () => {
      const isConnected = await checkApiConnectivity()
      expect(isConnected).toBe(true)
    })

    it('should get health status from backend', async () => {
      const health = await healthApi.checkHealth()
      expect(health.status).toBe('OK')
      expect(health.service).toBe('Aftercare Backend API')
      expect(health.timestamp).toBeDefined()
    })
  })

  describe('Brochure API Integration', () => {
    it('should fetch myomectomy brochure data', async () => {
      const brochure = await brochureApi.getMyomectomyBrochure()
      
      expect(brochure.title).toBe('Myomectomy Post-Operative Care Instructions')
      expect(brochure.activityRestrictions).toBeInstanceOf(Array)
      expect(brochure.activityRestrictions.length).toBeGreaterThan(0)
      expect(brochure.painManagement).toBeInstanceOf(Array)
      expect(brochure.warningSigns).toBeInstanceOf(Array)
      expect(brochure.followUpSchedule).toBeDefined()
      expect(brochure.healingTimeline).toBeDefined()
      expect(brochure.dietaryGuidelines).toBeInstanceOf(Array)
      expect(brochure.incisionCare).toBeInstanceOf(Array)
    })

    it('should fetch brochures list', async () => {
      const brochures = await brochureApi.getBrochuresList()
      
      expect(brochures).toBeInstanceOf(Array)
      expect(brochures.length).toBeGreaterThan(0)
      expect(brochures[0]).toHaveProperty('id')
      expect(brochures[0]).toHaveProperty('title')
      expect(brochures[0]).toHaveProperty('lastUpdated')
    })
  })

  describe('Patient Tracker API Integration', () => {
    const testPatientId = `test-patient-${Date.now()}`

    it('should create a patient tracker entry', async () => {
      const trackerData = {
        patientId: testPatientId,
        procedureType: 'myomectomy',
        symptoms: ['mild pain', 'slight fatigue'],
        notes: 'Integration test entry',
        painLevel: 3,
        medications: ['ibuprofen'],
        followUpNeeded: false,
        warningSignsPresent: false
      }

      const result = await trackerApi.createTrackerEntry(trackerData)
      
      expect(result.patientId).toBe(testPatientId)
      expect(result.procedureType).toBe('myomectomy')
      expect(result.symptoms).toEqual(['mild pain', 'slight fatigue'])
      expect(result.notes).toBe('Integration test entry')
      expect(result.painLevel).toBe(3)
      expect(result.timestamp).toBeDefined()
    })

    it('should handle validation errors for invalid tracker data', async () => {
      const invalidData = {
        patientId: '', // Invalid: empty patient ID
        procedureType: 'myomectomy',
        symptoms: ['test'],
        notes: 'Test',
        painLevel: 15 // Invalid: pain level > 10
      }

      await expect(trackerApi.createTrackerEntry(invalidData))
        .rejects
        .toThrow()
    })

    it('should retrieve patient tracker entries', async () => {
      // First create an entry
      const trackerData = {
        patientId: testPatientId,
        procedureType: 'myomectomy',
        symptoms: ['test symptom'],
        notes: 'Test retrieval',
        painLevel: 2
      }

      await trackerApi.createTrackerEntry(trackerData)

      // Then retrieve it
      const entries = await trackerApi.getPatientTrackers(testPatientId)
      
      expect(entries).toBeInstanceOf(Array)
      // Note: In memory mode, this might not return entries, but should not error
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Test with invalid endpoint
      const originalFetch = global.fetch
      global.fetch = () => Promise.reject(new Error('Network error'))

      await expect(healthApi.checkHealth()).rejects.toThrow('Network error')

      // Restore fetch
      global.fetch = originalFetch
    })
  })

  describe('Data Consistency', () => {
    it('should maintain consistent data structure between frontend types and backend responses', async () => {
      const brochure = await brochureApi.getMyomectomyBrochure()
      
      // Verify all expected properties exist
      const expectedProperties = [
        'title',
        'lastUpdated',
        'activityRestrictions',
        'painManagement',
        'warningSigns',
        'followUpSchedule',
        'healingTimeline',
        'dietaryGuidelines',
        'incisionCare'
      ]

      expectedProperties.forEach(prop => {
        expect(brochure).toHaveProperty(prop)
      })

      // Verify array properties are arrays
      const arrayProperties = [
        'activityRestrictions',
        'painManagement',
        'warningSigns',
        'dietaryGuidelines',
        'incisionCare'
      ]

      arrayProperties.forEach(prop => {
        expect(Array.isArray(brochure[prop as keyof typeof brochure])).toBe(true)
      })

      // Verify object properties are objects
      expect(typeof brochure.followUpSchedule).toBe('object')
      expect(typeof brochure.healingTimeline).toBe('object')
    })
  })
})
