import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  Icon,
  Box,
  Divider,
  List,
  ListItem,
  ListIcon,
  useColorModeValue
} from '@chakra-ui/react'
import { FiHeart, FiCheckCircle, FiBookOpen, FiTrendingUp, FiShield } from 'react-icons/fi'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const handleComplete = () => {
    onComplete()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" closeOnOverlayClick={false}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} borderRadius="xl" border="1px" borderColor={borderColor}>
        <ModalHeader>
          <HStack spacing={3}>
            <Icon as={FiHeart} color="brand.500" boxSize={6} />
            <Text fontSize="xl" fontWeight="bold" color="brand.600">
              Welcome to AfterCare
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontSize="md" color="semantic.text.body" lineHeight="1.6">
                Your personalized recovery companion for post-operative care. This platform helps you 
                track your healing journey and stay connected with your care instructions.
              </Text>
            </Box>

            <Divider />

            <Box>
              <Text fontSize="lg" fontWeight="semibold" color="brand.600" mb={4}>
                What you can do here:
              </Text>
              
              <List spacing={3}>
                <ListItem>
                  <HStack align="start" spacing={3}>
                    <ListIcon as={FiBookOpen} color="brand.500" mt={1} />
                    <Box>
                      <Text fontWeight="medium" color="semantic.text.body">
                        Access Care Instructions
                      </Text>
                      <Text fontSize="sm" color="semantic.text.muted">
                        View detailed post-operative guidelines, activity restrictions, and healing timelines
                      </Text>
                    </Box>
                  </HStack>
                </ListItem>

                <ListItem>
                  <HStack align="start" spacing={3}>
                    <ListIcon as={FiCheckCircle} color="brand.500" mt={1} />
                    <Box>
                      <Text fontWeight="medium" color="semantic.text.body">
                        Track Daily Tasks
                      </Text>
                      <Text fontSize="sm" color="semantic.text.muted">
                        Complete daily care tasks and monitor your progress with interactive checklists
                      </Text>
                    </Box>
                  </HStack>
                </ListItem>

                <ListItem>
                  <HStack align="start" spacing={3}>
                    <ListIcon as={FiTrendingUp} color="brand.500" mt={1} />
                    <Box>
                      <Text fontWeight="medium" color="semantic.text.body">
                        Log Symptoms & Progress
                      </Text>
                      <Text fontSize="sm" color="semantic.text.muted">
                        Record symptoms, pain levels, and personal notes to share with your healthcare team
                      </Text>
                    </Box>
                  </HStack>
                </ListItem>

                <ListItem>
                  <HStack align="start" spacing={3}>
                    <ListIcon as={FiShield} color="brand.500" mt={1} />
                    <Box>
                      <Text fontWeight="medium" color="semantic.text.body">
                        Offline Access
                      </Text>
                      <Text fontSize="sm" color="semantic.text.muted">
                        Access your care information anytime, even without an internet connection
                      </Text>
                    </Box>
                  </HStack>
                </ListItem>
              </List>
            </Box>

            <Divider />

            <Box bg="brand.50" p={4} borderRadius="lg" border="1px" borderColor="brand.200">
              <HStack spacing={2} mb={2}>
                <Icon as={FiHeart} color="brand.500" boxSize={4} />
                <Text fontSize="sm" fontWeight="semibold" color="brand.700">
                  Your Recovery Journey
                </Text>
              </HStack>
              <Text fontSize="sm" color="brand.600" lineHeight="1.5">
                Remember: This tool complements your healthcare team's guidance. Always contact your 
                doctor immediately if you experience any warning signs or have concerns about your recovery.
              </Text>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              Skip for now
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleComplete}
              leftIcon={<Icon as={FiCheckCircle} />}
            >
              Get Started
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default OnboardingModal
