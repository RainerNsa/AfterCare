import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Checkbox,
  Textarea,
  Button,
  Select,
  Text,
  Badge,
  Divider,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Spinner,
  useColorModeValue,
  useToast,
  Icon,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem
} from '@chakra-ui/react'
import {
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiRefreshCw,
  FiTrendingUp,
  FiAlertCircle,
  FiPlus
} from 'react-icons/fi'
import { useTracker } from '../context/TrackerContext'
import EnterpriseCard from './EnterpriseCard'

const InteractiveTracker: React.FC = () => {
  const { state, toggleTodo, addSymptom, updateNotes, syncWithBackend } = useTracker()
  const [newSymptom, setNewSymptom] = useState('')
  const [symptomSeverity, setSymptomSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild')
  const [patientId] = useState('demo-patient-001') // In a real app, this would come from authentication
  const toast = useToast()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const handleTodoToggle = (todoId: string) => {
    const todo = state.data.todos.find(t => t.id === todoId)
    toggleTodo(todoId)

    if (todo) {
      toast({
        title: todo.completed ? 'Task unmarked' : 'Task completed!',
        description: todo.text,
        status: todo.completed ? 'info' : 'success',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const handleAddSymptom = () => {
    if (!newSymptom.trim()) return

    addSymptom(newSymptom.trim(), symptomSeverity)
    setNewSymptom('')
    setSymptomSeverity('mild')

    toast({
      title: 'Symptom logged',
      description: `${newSymptom} (${symptomSeverity})`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleNotesChange = (value: string) => {
    updateNotes(value)
  }

  const handleSyncWithBackend = async () => {
    try {
      await syncWithBackend(patientId)
      toast({
        title: 'Sync successful',
        description: 'Your data has been saved to the server',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Sync failed',
        description: 'Could not save to server. Data is saved locally.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'green'
      case 'moderate': return 'yellow'
      case 'severe': return 'red'
      default: return 'gray'
    }
  }

  // Calculate progress statistics
  const completedTodos = state.data.todos.filter(todo => todo.completed).length
  const totalTodos = state.data.todos.length
  const progressPercentage = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0

  return (
    <VStack spacing={6} align="stretch">
      {/* Progress Overview Card */}
      <EnterpriseCard
        title="Recovery Overview"
        icon={FiTrendingUp}
        badge={{
          text: `${Math.round(progressPercentage)}% Complete`,
          colorScheme: progressPercentage > 75 ? 'green' : progressPercentage > 50 ? 'blue' : 'orange'
        }}
        variant="elevated"
        headerAction={
          <Button
            onClick={handleSyncWithBackend}
            size="sm"
            variant="ghost"
            colorScheme="brand"
            isLoading={state.loading}
            loadingText="Syncing..."
            leftIcon={<Icon as={FiRefreshCw} />}
          >
            Sync
          </Button>
        }
      >
        <VStack spacing={4}>
          {/* Error Alert */}
          {state.error && (
            <Alert status="warning" borderRadius="lg" variant="left-accent">
              <AlertIcon />
              <Text fontSize="sm">{state.error}</Text>
            </Alert>
          )}

          {/* Progress Stats */}
          <Grid templateColumns="repeat(3, 1fr)" gap={4} w="full">
            <GridItem>
              <Stat textAlign="center">
                <StatLabel fontSize="xs" color="semantic.text.muted">Tasks Done</StatLabel>
                <StatNumber fontSize="2xl" color="brand.600">{completedTodos}</StatNumber>
                <StatHelpText fontSize="xs">of {totalTodos}</StatHelpText>
              </Stat>
            </GridItem>

            <GridItem>
              <Stat textAlign="center">
                <StatLabel fontSize="xs" color="semantic.text.muted">Symptoms</StatLabel>
                <StatNumber fontSize="2xl" color="orange.500">{state.data.symptoms.length}</StatNumber>
                <StatHelpText fontSize="xs">logged</StatHelpText>
              </Stat>
            </GridItem>

            <GridItem>
              <Stat textAlign="center">
                <StatLabel fontSize="xs" color="semantic.text.muted">Notes</StatLabel>
                <StatNumber fontSize="2xl" color="purple.500">
                  {state.data.notes.length > 0 ? '✓' : '—'}
                </StatNumber>
                <StatHelpText fontSize="xs">updated</StatHelpText>
              </Stat>
            </GridItem>
          </Grid>

          {/* Progress Bar */}
          <Box w="full">
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="600" color="semantic.text.secondary">
                Daily Tasks Progress
              </Text>
              <Text fontSize="sm" color="semantic.text.muted">
                {completedTodos}/{totalTodos}
              </Text>
            </HStack>
            <Progress
              value={progressPercentage}
              colorScheme={progressPercentage > 75 ? 'green' : progressPercentage > 50 ? 'blue' : 'orange'}
              borderRadius="full"
              size="lg"
              bg="gray.100"
            />
          </Box>
        </VStack>
      </EnterpriseCard>

      {/* Daily Tasks Card */}
      <EnterpriseCard
        title="Daily Care Tasks"
        icon={FiCheckCircle}
        badge={{
          text: `${completedTodos}/${totalTodos} Complete`,
          colorScheme: completedTodos === totalTodos ? 'green' : 'blue',
          variant: 'subtle'
        }}
        variant="default"
      >
        <VStack align="stretch" spacing={3}>
          {state.data.todos.map((todo, index) => (
            <Box
              key={todo.id}
              p={4}
              bg={todo.completed ? 'green.50' : 'gray.50'}
              borderRadius="lg"
              border="2px solid"
              borderColor={todo.completed ? 'green.200' : 'gray.200'}
              transition="all 0.2s ease-in-out"
              _hover={{
                borderColor: todo.completed ? 'green.300' : 'brand.300',
                transform: 'translateY(-1px)',
                boxShadow: 'sm'
              }}
            >
              <HStack spacing={4} align="flex-start">
                <Checkbox
                  isChecked={todo.completed}
                  onChange={() => handleTodoToggle(todo.id)}
                  colorScheme={todo.completed ? 'green' : 'brand'}
                  size="lg"
                  borderRadius="md"
                />

                <VStack align="flex-start" spacing={1} flex={1}>
                  <Text
                    fontSize="md"
                    fontWeight="600"
                    textDecoration={todo.completed ? 'line-through' : 'none'}
                    color={todo.completed ? 'green.700' : 'semantic.text.primary'}
                    lineHeight="1.5"
                  >
                    {todo.text}
                  </Text>

                  {todo.completed && todo.timestamp && (
                    <HStack spacing={1}>
                      <Icon as={FiClock} boxSize={3} color="green.500" />
                      <Text fontSize="xs" color="green.600" fontWeight="500">
                        Completed {todo.timestamp.toLocaleTimeString()}
                      </Text>
                    </HStack>
                  )}
                </VStack>

                <Box
                  w={6}
                  h={6}
                  bg={todo.completed ? 'green.100' : 'gray.100'}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                  fontWeight="bold"
                  color={todo.completed ? 'green.600' : 'gray.500'}
                >
                  {index + 1}
                </Box>
              </HStack>
            </Box>
          ))}
        </VStack>
      </EnterpriseCard>

      {/* Symptom Tracker Card */}
      <EnterpriseCard
        title="Symptom Tracker"
        icon={FiAlertCircle}
        badge={{
          text: `${state.data.symptoms.length} Logged`,
          colorScheme: 'orange',
          variant: 'subtle'
        }}
        variant="default"
      >
        <VStack align="stretch" spacing={4}>
          {/* Add Symptom Form */}
          <Box
            p={4}
            bg="orange.50"
            borderRadius="lg"
            border="1px solid"
            borderColor="orange.200"
          >
            <VStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color="semantic.text.primary">
                  Describe Symptom
                </FormLabel>
                <Textarea
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  placeholder="Describe any symptoms you're experiencing in detail..."
                  rows={3}
                  borderRadius="lg"
                  borderWidth="2px"
                  _focus={{
                    borderColor: 'orange.400',
                    boxShadow: '0 0 0 3px rgba(251, 146, 60, 0.12)'
                  }}
                />
              </FormControl>

              <HStack w="full" spacing={4}>
                <FormControl flex={1}>
                  <FormLabel fontSize="sm" fontWeight="600" color="semantic.text.primary">
                    Severity Level
                  </FormLabel>
                  <Select
                    value={symptomSeverity}
                    onChange={(e) => setSymptomSeverity(e.target.value as 'mild' | 'moderate' | 'severe')}
                    borderRadius="lg"
                    borderWidth="2px"
                    _focus={{
                      borderColor: 'orange.400',
                      boxShadow: '0 0 0 3px rgba(251, 146, 60, 0.12)'
                    }}
                  >
                    <option value="mild">Mild - Minor discomfort</option>
                    <option value="moderate">Moderate - Noticeable symptoms</option>
                    <option value="severe">Severe - Significant concern</option>
                  </Select>
                </FormControl>

                <Button
                  onClick={handleAddSymptom}
                  colorScheme="orange"
                  size="lg"
                  isDisabled={!newSymptom.trim()}
                  leftIcon={<Icon as={FiPlus} />}
                  borderRadius="lg"
                  fontWeight="600"
                  alignSelf="flex-end"
                >
                  Log Symptom
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Recent Symptoms Display */}
          {state.data.symptoms.length > 0 && (
            <Box>
              <Text fontSize="sm" fontWeight="600" mb={3} color="semantic.text.secondary">
                Recent Symptoms ({state.data.symptoms.length})
              </Text>
              <VStack align="stretch" spacing={3} maxH="300px" overflowY="auto">
                {state.data.symptoms.slice(0, 5).map(symptom => (
                  <Box
                    key={symptom.id}
                    p={4}
                    bg="white"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="orange.200"
                    boxShadow="sm"
                  >
                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between" align="flex-start">
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="semantic.text.primary"
                          flex={1}
                          lineHeight="1.5"
                        >
                          {symptom.symptom}
                        </Text>
                        <Badge
                          colorScheme={getSeverityColor(symptom.severity)}
                          variant="solid"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="xs"
                          fontWeight="700"
                          textTransform="uppercase"
                        >
                          {symptom.severity}
                        </Badge>
                      </HStack>

                      <HStack spacing={2}>
                        <Icon as={FiClock} boxSize={3} color="gray.400" />
                        <Text fontSize="xs" color="semantic.text.muted" fontWeight="500">
                          {symptom.timestamp.toLocaleString()}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      </EnterpriseCard>

      {/* Personal Notes Card */}
      <EnterpriseCard
        title="Personal Notes"
        icon={FiEdit3}
        variant="default"
      >
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="600" color="semantic.text.primary">
            Recovery Journal
          </FormLabel>
          <Textarea
            value={state.data.notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Document your recovery progress, feelings, questions for your doctor, or any observations about your healing process..."
            rows={6}
            resize="vertical"
            borderRadius="lg"
            borderWidth="2px"
            _focus={{
              borderColor: 'brand.400',
              boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.12)'
            }}
            fontSize="md"
            lineHeight="1.6"
          />
          <Text fontSize="xs" color="semantic.text.muted" mt={2}>
            Your notes are automatically saved and can be shared with your healthcare provider.
          </Text>
        </FormControl>
      </EnterpriseCard>

      {/* Status Information Card */}
      <Box
        p={4}
        bg="gray.50"
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.200"
      >
        <VStack spacing={2}>
          <HStack spacing={4} justify="center" wrap="wrap">
            <HStack spacing={2}>
              <Icon as={FiClock} boxSize={4} color="gray.500" />
              <Text fontSize="sm" color="semantic.text.muted" fontWeight="500">
                Last updated: {state.data.lastUpdated.toLocaleString()}
              </Text>
            </HStack>

            {state.lastSyncedWithBackend && (
              <HStack spacing={2}>
                <Icon as={FiCheckCircle} boxSize={4} color="green.500" />
                <Text fontSize="sm" color="green.600" fontWeight="600">
                  Last synced: {state.lastSyncedWithBackend.toLocaleString()}
                </Text>
              </HStack>
            )}
          </HStack>

          <Text fontSize="xs" color="semantic.text.muted" textAlign="center">
            All data is automatically saved locally and can be synced with your healthcare provider
          </Text>
        </VStack>
      </Box>
    </VStack>
  )
}

export default InteractiveTracker
