import React from 'react'
import {
  Box,
  Text,
  Progress,
  HStack,
  VStack,
  Icon,
  Badge,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react'
import { FiTrendingUp, FiTarget, FiAward } from 'react-icons/fi'

interface ProgressTrackerProps {
  progress: number
  totalTasks: number
  completedTasks: number
  className?: string
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  totalTasks,
  completedTasks,
  className
}) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'green'
    if (progress >= 60) return 'blue'
    if (progress >= 40) return 'yellow'
    return 'red'
  }

  const getProgressMessage = (progress: number) => {
    if (progress >= 90) return 'Excellent progress! 🎉'
    if (progress >= 70) return 'Great job! Keep it up! 💪'
    if (progress >= 50) return 'Good progress! 👍'
    if (progress >= 25) return 'Getting started! 🌱'
    return 'Begin your recovery journey! ✨'
  }

  const getMilestoneIcon = (progress: number) => {
    if (progress >= 80) return FiAward
    if (progress >= 50) return FiTarget
    return FiTrendingUp
  }

  return (
    <Box
      className={className}
      bg={bgColor}
      p={6}
      borderRadius="xl"
      border="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="center">
          <HStack spacing={2}>
            <Icon 
              as={getMilestoneIcon(progress)} 
              color={`${getProgressColor(progress)}.500`} 
              boxSize={5} 
            />
            <Text fontSize="lg" fontWeight="semibold" color="semantic.text.body">
              Recovery Progress
            </Text>
          </HStack>
          
          <Badge
            colorScheme={getProgressColor(progress)}
            variant="subtle"
            fontSize="sm"
            px={3}
            py={1}
            borderRadius="full"
          >
            {Math.round(progress)}%
          </Badge>
        </HStack>

        <Box>
          <Progress
            value={progress}
            colorScheme={getProgressColor(progress)}
            size="lg"
            borderRadius="full"
            bg={useColorModeValue('gray.100', 'gray.700')}
          />
          
          <HStack justify="space-between" mt={2}>
            <Text fontSize="sm" color="semantic.text.muted">
              {completedTasks} of {totalTasks} tasks completed
            </Text>
            <Text fontSize="sm" color={`${getProgressColor(progress)}.600`} fontWeight="medium">
              {Math.round(progress)}%
            </Text>
          </HStack>
        </Box>

        <Box
          bg={`${getProgressColor(progress)}.50`}
          p={3}
          borderRadius="lg"
          border="1px"
          borderColor={`${getProgressColor(progress)}.200`}
        >
          <Text
            fontSize="sm"
            color={`${getProgressColor(progress)}.700`}
            fontWeight="medium"
            textAlign="center"
          >
            {getProgressMessage(progress)}
          </Text>
        </Box>

        {/* Milestone indicators */}
        <HStack justify="space-between" spacing={1}>
          {[25, 50, 75, 100].map((milestone) => (
            <Tooltip
              key={milestone}
              label={`${milestone}% milestone`}
              placement="top"
            >
              <Box
                w={3}
                h={3}
                borderRadius="full"
                bg={progress >= milestone ? `${getProgressColor(progress)}.500` : 'gray.300'}
                transition="all 0.2s"
                cursor="pointer"
                _hover={{
                  transform: 'scale(1.2)',
                }}
              />
            </Tooltip>
          ))}
        </HStack>

        {/* Recovery insights */}
        {progress > 0 && (
          <Box
            bg={useColorModeValue('blue.50', 'blue.900')}
            p={3}
            borderRadius="lg"
            border="1px"
            borderColor={useColorModeValue('blue.200', 'blue.700')}
          >
            <Text fontSize="xs" color="blue.600" fontWeight="medium" mb={1}>
              💡 Recovery Insight
            </Text>
            <Text fontSize="xs" color="blue.700" lineHeight="1.4">
              {progress >= 75 
                ? "You're in the final stretch! Focus on gradual activity increases."
                : progress >= 50
                ? "Great momentum! Continue following your care plan consistently."
                : progress >= 25
                ? "Building good habits! Each completed task supports your healing."
                : "Every step counts in your recovery journey. Stay consistent!"
              }
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  )
}

export default ProgressTracker
