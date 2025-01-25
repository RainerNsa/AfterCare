import React from 'react'
import {
  Box,
  Heading,
  VStack,
  UnorderedList,
  ListItem,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  useColorModeValue,
  HStack,
  Icon,
  Divider
} from '@chakra-ui/react'
import { FiAlertTriangle, FiInfo, FiClock, FiCheckCircle } from 'react-icons/fi'
import EnterpriseCard from './EnterpriseCard'

interface BrochureSectionProps {
  title: string
  items: string[] | Record<string, string>
  type?: 'list' | 'timeline' | 'warning'
  isCollapsible?: boolean
  defaultExpanded?: boolean
}

const BrochureSection: React.FC<BrochureSectionProps> = ({
  title,
  items,
  type = 'list',
  isCollapsible = false,
  defaultExpanded = true
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'warning':
        return {
          icon: FiAlertTriangle,
          badge: { text: 'Important', colorScheme: 'red', variant: 'solid' as const },
          variant: 'elevated' as const,
          iconColor: 'red.600',
          bgColor: 'red.50'
        }
      case 'timeline':
        return {
          icon: FiClock,
          badge: { text: 'Schedule', colorScheme: 'blue', variant: 'subtle' as const },
          variant: 'default' as const,
          iconColor: 'blue.600',
          bgColor: 'blue.50'
        }
      default:
        return {
          icon: FiCheckCircle,
          badge: undefined,
          variant: 'default' as const,
          iconColor: 'brand.600',
          bgColor: 'brand.50'
        }
    }
  }

  const typeConfig = getTypeConfig()

  const renderContent = () => {
    if (Array.isArray(items)) {
      return (
        <VStack align="stretch" spacing={3}>
          {items.map((item, index) => (
            <HStack key={index} align="flex-start" spacing={3}>
              <Box
                w={2}
                h={2}
                bg="brand.500"
                borderRadius="full"
                mt={2}
                flexShrink={0}
              />
              <Text
                fontSize="md"
                lineHeight="1.7"
                color="semantic.text.primary"
                fontWeight="500"
              >
                {item}
              </Text>
            </HStack>
          ))}
        </VStack>
      )
    } else {
      // Handle timeline/object format
      return (
        <VStack align="stretch" spacing={4}>
          {Object.entries(items).map(([key, value], index) => (
            <Box
              key={key}
              p={4}
              bg={typeConfig.bgColor}
              borderRadius="lg"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
              position="relative"
            >
              {/* Timeline connector */}
              {index < Object.entries(items).length - 1 && (
                <Box
                  position="absolute"
                  left={6}
                  bottom="-12px"
                  w="2px"
                  h="12px"
                  bg="brand.300"
                />
              )}

              <HStack align="flex-start" spacing={3}>
                <Box
                  p={2}
                  bg="white"
                  borderRadius="lg"
                  border="2px solid"
                  borderColor="brand.200"
                >
                  <Icon as={FiClock} boxSize={4} color="brand.600" />
                </Box>

                <VStack align="flex-start" spacing={2} flex={1}>
                  <Text
                    fontWeight="700"
                    fontSize="md"
                    color="semantic.text.primary"
                    textTransform="capitalize"
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Text>
                  <Text
                    fontSize="sm"
                    color="semantic.text.secondary"
                    lineHeight="1.6"
                  >
                    {value}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      )
    }
  }

  const content = (
    <EnterpriseCard
      title={title}
      icon={typeConfig.icon}
      badge={typeConfig.badge}
      variant={typeConfig.variant}
    >
      <Box
        role="region"
        aria-labelledby={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        {renderContent()}
      </Box>
    </EnterpriseCard>
  )

  if (isCollapsible) {
    return (
      <Accordion allowToggle defaultIndex={defaultExpanded ? [0] : []}>
        <AccordionItem border="none">
          <AccordionButton
            p={0}
            _hover={{ bg: 'transparent' }}
            _focus={{ boxShadow: 'outline' }}
          >
            <Box flex="1">
              {content}
            </Box>
            <AccordionIcon ml={2} />
          </AccordionButton>
          <AccordionPanel p={0} pt={4}>
            {/* Additional content can go here if needed */}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    )
  }

  return content
}

export default BrochureSection
