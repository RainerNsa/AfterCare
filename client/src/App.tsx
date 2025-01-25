import React, { useState, useEffect, Suspense, lazy } from 'react'
import {
  Box,
  Container,
  VStack,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Text,
  useToast,
  useBreakpointValue
} from '@chakra-ui/react'
import Header from './components/Header'
import OnboardingModal from './components/OnboardingModal'
import ProgressTracker from './components/ProgressTracker'
// Lazy load components for better performance
const BrochureSection = lazy(() => import('./components/BrochureSection'))
const InteractiveTracker = lazy(() => import('./components/InteractiveTracker'))
import { TrackerProvider, useTracker } from './context/TrackerContext'
import { brochureApi, checkApiConnectivity, handleApiError } from './services/api'
import type { BrochureData } from './types'

// Main app content component that uses tracker context
const AppContent: React.FC = () => {
  const [brochureData, setBrochureData] = useState<BrochureData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiConnected, setApiConnected] = useState(false)
  const toast = useToast()

  // Use tracker context for onboarding and progress
  const { state: trackerState, completeOnboarding, calculateProgress } = useTracker()

  // Responsive grid layout
  const gridTemplateColumns = useBreakpointValue({
    base: '1fr',
    lg: '2fr 1fr'
  })

  const gridGap = useBreakpointValue({
    base: 6,
    lg: 8
  })

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check API connectivity
        const connected = await checkApiConnectivity()
        setApiConnected(connected)

        if (connected) {
          // Fetch brochure data
          const data = await brochureApi.getMyomectomyBrochure()
          setBrochureData(data)
        } else {
          // Use fallback data if API is not available
          setBrochureData(getFallbackBrochureData())
          toast({
            title: 'Offline Mode',
            description: 'Using cached content. Some features may be limited.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          })
        }
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
        setBrochureData(getFallbackBrochureData())
        toast({
          title: 'Error loading content',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [toast])

  // Fallback data for offline mode
  const getFallbackBrochureData = (): BrochureData => ({
    title: "Myomectomy Post-Operative Care Instructions",
    lastUpdated: "2025-01-25",
    activityRestrictions: [
      "Lifting: Avoid lifting more than 1 gallon of milk (approximately 8 lbs) for 4-6 weeks",
      "Driving: Restricted until pain medications are discontinued and you can safely operate a vehicle",
      "Intercourse: No sexual activity for 6 weeks to allow proper healing",
      "Exercise: No strenuous exercise or heavy lifting for 4-6 weeks",
      "Work: Return to desk work when comfortable, typically 1-2 weeks; physical work may require 4-6 weeks"
    ],
    painManagement: [
      "Take prescribed pain medications as directed by your physician",
      "Use stool softeners if experiencing constipation from pain medications",
      "Apply ice packs to incision area for 15-20 minutes every 2-3 hours for first 48 hours",
      "Take medications with food to prevent stomach upset"
    ],
    warningSigns: [
      "Fever greater than 100.4°F (38°C)",
      "Heavy bleeding requiring more than one pad per hour",
      "Severe unrelieved abdominal pain",
      "Signs of infection: increased redness, warmth, swelling, or drainage from incision"
    ],
    followUpSchedule: {
      "postOpAppointment": "Post-operative appointment scheduled at 4-6 weeks",
      "urgentCare": "Contact office immediately if warning signs occur",
      "routineQuestions": "Call office during business hours for routine questions"
    },
    healingTimeline: {
      "fullRecovery": "Full recovery typically takes 4-6 weeks",
      "dischargeTime": "Hospital discharge usually occurs 4-8 hours after procedure for outpatient cases",
      "returnToNormalActivity": "Gradual return to normal activities over 4-6 weeks"
    },
    dietaryGuidelines: [
      "Start with clear liquids and advance to regular diet as tolerated",
      "Increase fiber intake to prevent constipation",
      "Stay well hydrated - drink 8-10 glasses of water daily",
      "Avoid alcohol while taking pain medications"
    ],
    incisionCare: [
      "Keep incision clean and dry",
      "Gently wash with soap and water during shower",
      "Pat dry - do not rub the incision area",
      "Do not apply lotions, creams, or ointments unless prescribed"
    ]
  })

  if (loading) {
    return (
      <Box minH="100vh" bg="semantic.surface">
        <Header isOnline={apiConnected} />
        <Container maxW="container.xl" py={12}>
          <VStack spacing={6} align="center" minH="40vh" justify="center">
            <Box
              w={16}
              h={16}
              border="4px solid"
              borderColor="brand.200"
              borderTopColor="brand.600"
              borderRadius="full"
              animation="spin 1s linear infinite"
            />
            <VStack spacing={2}>
              <Text fontSize="lg" fontWeight="600" color="semantic.text.primary">
                Loading your aftercare information...
              </Text>
              <Text fontSize="sm" color="semantic.text.muted">
                Preparing your personalized recovery dashboard
              </Text>
            </VStack>
          </VStack>
        </Container>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="semantic.surface">
      {/* Enterprise Header */}
      <Header
        isOnline={apiConnected}
        lastSynced={null} // This would come from tracker context in a real app
        patientName="Patient"
        procedureType="Myomectomy"
      />

      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Offline Mode Alert */}
          {!apiConnected && (
            <Alert
              status="warning"
              borderRadius="xl"
              variant="left-accent"
              bg="orange.50"
              borderColor="orange.200"
            >
              <AlertIcon />
              <Box>
                <AlertTitle fontSize="md" fontWeight="700">Offline Mode Active</AlertTitle>
                <AlertDescription fontSize="sm" mt={1}>
                  You're viewing cached content. Some features may be limited until connection is restored.
                </AlertDescription>
              </Box>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert
              status="error"
              borderRadius="xl"
              variant="left-accent"
              bg="red.50"
              borderColor="red.200"
            >
              <AlertIcon />
              <Box>
                <AlertTitle fontSize="md" fontWeight="700">Connection Error</AlertTitle>
                <AlertDescription fontSize="sm" mt={1}>{error}</AlertDescription>
              </Box>
            </Alert>
          )}

          {/* Progress Tracker */}
          <ProgressTracker
            progress={trackerState.progress}
            totalTasks={trackerState.totalTasks}
            completedTasks={trackerState.data.todos.filter(todo => todo.completed).length}
          />

          {/* Main Content Grid */}
          <Grid
            templateColumns={gridTemplateColumns}
            gap={gridGap}
            alignItems="start"
          >
            {/* Left Column - Brochure Content */}
            <GridItem>
              <Suspense fallback={
                <VStack spacing={6} align="center" minH="40vh" justify="center">
                  <Spinner size="lg" color="brand.600" />
                  <Text fontSize="md" color="semantic.text.muted">
                    Loading care instructions...
                  </Text>
                </VStack>
              }>
                <VStack spacing={6} align="stretch">
                  {brochureData && (
                    <>
                      <BrochureSection
                        title="Activity Restrictions"
                        items={brochureData.activityRestrictions}
                        type="list"
                      />

                      <BrochureSection
                        title="Warning Signs - Contact Your Doctor Immediately"
                        items={brochureData.warningSigns}
                        type="warning"
                      />

                      <BrochureSection
                        title="Pain Management"
                        items={brochureData.painManagement}
                        type="list"
                      />

                      <BrochureSection
                        title="Follow-up Schedule"
                        items={brochureData.followUpSchedule}
                        type="timeline"
                      />

                      <BrochureSection
                        title="Healing Timeline"
                        items={brochureData.healingTimeline}
                        type="timeline"
                      />

                      <BrochureSection
                        title="Dietary Guidelines"
                        items={brochureData.dietaryGuidelines}
                        type="list"
                      />

                      <BrochureSection
                        title="Incision Care"
                        items={brochureData.incisionCare}
                        type="list"
                      />
                    </>
                  )}
                </VStack>
              </Suspense>
            </GridItem>

            {/* Right Column - Interactive Tracker */}
            <GridItem>
              <Box position="sticky" top={6}>
                <Suspense fallback={
                  <Box p={6} bg="white" borderRadius="xl" shadow="sm">
                    <VStack spacing={4} align="center">
                      <Spinner size="md" color="brand.600" />
                      <Text fontSize="sm" color="semantic.text.muted">
                        Loading tracker...
                      </Text>
                    </VStack>
                  </Box>
                }>
                  <InteractiveTracker />
                </Suspense>
              </Box>
            </GridItem>
          </Grid>
        </VStack>
      </Container>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={!trackerState.onboardingComplete}
        onClose={() => {}}
        onComplete={completeOnboarding}
      />
    </Box>
  )
}

// Main App component with TrackerProvider
function App() {
  return (
    <TrackerProvider>
      <AppContent />
    </TrackerProvider>
  )
}

export default App
