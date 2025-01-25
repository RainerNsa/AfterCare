import React from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Container,
  Divider
} from '@chakra-ui/react'
import { FiActivity, FiShield, FiClock } from 'react-icons/fi'

interface HeaderProps {
  isOnline: boolean
  lastSynced?: Date | null
  patientName?: string
  procedureType?: string
}

const Header: React.FC<HeaderProps> = ({
  isOnline,
  lastSynced,
  patientName = "Patient",
  procedureType = "Myomectomy"
}) => {
  const bgGradient = useColorModeValue(
    'linear(to-r, brand.600, brand.700)',
    'linear(to-r, brand.700, brand.800)'
  )
  
  const statusColor = isOnline ? 'green' : 'orange'
  const statusText = isOnline ? 'Online' : 'Offline'

  return (
    <Box
      bgGradient={bgGradient}
      color="white"
      py={8}
      position="relative"
      overflow="hidden"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        bgImage="radial-gradient(circle at 25% 25%, white 2px, transparent 2px)"
        bgSize="24px 24px"
      />
      
      <Container maxW="container.xl" position="relative">
        <VStack spacing={6} align="stretch">
          {/* Main Header */}
          <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4}>
            <VStack align="flex-start" spacing={2}>
              <HStack spacing={3}>
                <Icon as={FiActivity} boxSize={8} />
                <VStack align="flex-start" spacing={0}>
                  <Heading as="h1" size="xl" fontWeight="800">
                    Aftercare Management
                  </Heading>
                  <Text fontSize="lg" opacity={0.9} fontWeight="500">
                    Post-Operative Recovery Platform
                  </Text>
                </VStack>
              </HStack>
              
              <HStack spacing={4} mt={2}>
                <Badge
                  colorScheme={statusColor}
                  variant="solid"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="600"
                >
                  <HStack spacing={1}>
                    <Box w={2} h={2} bg="currentColor" borderRadius="full" />
                    <Text>{statusText}</Text>
                  </HStack>
                </Badge>
                
                {lastSynced && (
                  <Badge
                    colorScheme="blue"
                    variant="outline"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                    bg="whiteAlpha.200"
                    borderColor="whiteAlpha.300"
                    color="white"
                  >
                    <HStack spacing={1}>
                      <Icon as={FiClock} boxSize={3} />
                      <Text>Synced {lastSynced.toLocaleTimeString()}</Text>
                    </HStack>
                  </Badge>
                )}
              </HStack>
            </VStack>

            {/* Patient Info Card */}
            <Box
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
              borderRadius="xl"
              p={4}
              border="1px solid"
              borderColor="whiteAlpha.300"
              minW="280px"
            >
              <VStack align="flex-start" spacing={2}>
                <HStack spacing={2}>
                  <Icon as={FiShield} boxSize={5} />
                  <Text fontSize="sm" fontWeight="600" opacity={0.9}>
                    Patient Information
                  </Text>
                </HStack>
                
                <Divider borderColor="whiteAlpha.300" />
                
                <VStack align="flex-start" spacing={1} w="full">
                  <HStack justify="space-between" w="full">
                    <Text fontSize="sm" opacity={0.8}>Name:</Text>
                    <Text fontSize="sm" fontWeight="600">{patientName}</Text>
                  </HStack>
                  
                  <HStack justify="space-between" w="full">
                    <Text fontSize="sm" opacity={0.8}>Procedure:</Text>
                    <Text fontSize="sm" fontWeight="600">{procedureType}</Text>
                  </HStack>
                  
                  <HStack justify="space-between" w="full">
                    <Text fontSize="sm" opacity={0.8}>Date:</Text>
                    <Text fontSize="sm" fontWeight="600">
                      {new Date().toLocaleDateString()}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          </Flex>

          {/* Progress Indicator */}
          <Box
            bg="whiteAlpha.200"
            borderRadius="lg"
            p={4}
            border="1px solid"
            borderColor="whiteAlpha.300"
          >
            <HStack justify="space-between" align="center">
              <VStack align="flex-start" spacing={1}>
                <Text fontSize="sm" fontWeight="600" opacity={0.9}>
                  Recovery Progress
                </Text>
                <Text fontSize="xs" opacity={0.7}>
                  Track your post-operative care and recovery milestones
                </Text>
              </VStack>
              
              <HStack spacing={4}>
                <VStack spacing={1}>
                  <Text fontSize="xs" opacity={0.7}>Today</Text>
                  <Text fontSize="lg" fontWeight="700">Day 1</Text>
                </VStack>
                
                <Box w="1px" h="8" bg="whiteAlpha.300" />
                
                <VStack spacing={1}>
                  <Text fontSize="xs" opacity={0.7}>Target</Text>
                  <Text fontSize="lg" fontWeight="700">6 Weeks</Text>
                </VStack>
              </HStack>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default Header
