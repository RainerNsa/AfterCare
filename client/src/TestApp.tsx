import React from 'react'
import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { FiCheckCircle } from 'react-icons/fi'
import EnterpriseCard from './components/EnterpriseCard'

function TestApp() {
  return (
    <Box p={8} bg="semantic.surface" minH="100vh">
      <VStack spacing={6} maxW="container.md" mx="auto">
        <Heading as="h1" size="xl" color="brand.600">
          Enterprise UI Test
        </Heading>

        <EnterpriseCard
          title="Test Card"
          icon={FiCheckCircle}
          badge={{
            text: "Working",
            colorScheme: "green",
            variant: "solid"
          }}
          variant="elevated"
        >
          <Text>
            If you can see this card with proper styling, the enterprise UI is working correctly!
          </Text>
        </EnterpriseCard>

        <Box p={4} bg="green.100" borderRadius="md" w="full">
          <Text color="green.800" fontWeight="600">
            ✅ React is rendering
          </Text>
          <Text color="green.800" fontWeight="600">
            ✅ Chakra UI is working
          </Text>
          <Text color="green.800" fontWeight="600">
            ✅ Custom theme is applied
          </Text>
          <Text color="green.800" fontWeight="600">
            ✅ React Icons are working
          </Text>
          <Text color="green.800" fontWeight="600">
            ✅ Enterprise components are functional
          </Text>
        </Box>
      </VStack>
    </Box>
  )
}

export default TestApp
