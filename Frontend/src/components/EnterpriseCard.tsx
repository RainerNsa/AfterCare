import React from 'react'
import {
  Box,
  Heading,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Badge,
  Divider
} from '@chakra-ui/react'

interface EnterpriseCardProps {
  title: string
  icon?: React.ComponentType<any>
  badge?: {
    text: string
    colorScheme: string
    variant?: 'solid' | 'subtle' | 'outline'
  }
  variant?: 'default' | 'elevated' | 'outline' | 'glass'
  children: React.ReactNode
  headerAction?: React.ReactNode
  isLoading?: boolean
}

const EnterpriseCard: React.FC<EnterpriseCardProps> = ({
  title,
  icon,
  badge,
  variant = 'default',
  children,
  headerAction,
  isLoading = false
}) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const shadowColor = useColorModeValue('gray.100', 'gray.900')

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          bg: bgColor,
          borderRadius: 'xl',
          boxShadow: 'xl',
          border: 'none',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: '2xl',
          },
          transition: 'all 0.2s ease-in-out',
        }
      case 'outline':
        return {
          bg: 'transparent',
          borderRadius: 'xl',
          border: '2px solid',
          borderColor: borderColor,
          _hover: {
            borderColor: 'brand.300',
            boxShadow: 'md',
          },
          transition: 'all 0.2s ease-in-out',
        }
      case 'glass':
        return {
          bg: 'whiteAlpha.800',
          backdropFilter: 'blur(10px)',
          borderRadius: 'xl',
          border: '1px solid',
          borderColor: 'whiteAlpha.300',
          boxShadow: 'lg',
        }
      default:
        return {
          bg: bgColor,
          borderRadius: 'xl',
          border: '1px solid',
          borderColor: borderColor,
          boxShadow: 'sm',
          _hover: {
            boxShadow: 'md',
            borderColor: 'brand.200',
          },
          transition: 'all 0.2s ease-in-out',
        }
    }
  }

  return (
    <Box
      {...getVariantStyles()}
      p={6}
      position="relative"
      overflow="hidden"
    >
      {/* Loading Overlay */}
      {isLoading && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="whiteAlpha.800"
          backdropFilter="blur(2px)"
          zIndex={10}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            w={8}
            h={8}
            border="3px solid"
            borderColor="brand.200"
            borderTopColor="brand.600"
            borderRadius="full"
            animation="spin 1s linear infinite"
          />
        </Box>
      )}

      <VStack align="stretch" spacing={4}>
        {/* Header */}
        <HStack justify="space-between" align="flex-start">
          <HStack spacing={3} flex={1}>
            {icon && (
              <Box
                p={2}
                bg="brand.50"
                borderRadius="lg"
                color="brand.600"
              >
                <Icon as={icon} boxSize={5} />
              </Box>
            )}
            
            <VStack align="flex-start" spacing={1} flex={1}>
              <HStack spacing={2} align="center">
                <Heading
                  as="h3"
                  size="md"
                  color="semantic.text.primary"
                  fontWeight="700"
                >
                  {title}
                </Heading>
                
                {badge && (
                  <Badge
                    colorScheme={badge.colorScheme}
                    variant={badge.variant || 'subtle'}
                    borderRadius="full"
                    px={2}
                    py={1}
                    fontSize="xs"
                    fontWeight="600"
                  >
                    {badge.text}
                  </Badge>
                )}
              </HStack>
            </VStack>
          </HStack>

          {headerAction && (
            <Box flexShrink={0}>
              {headerAction}
            </Box>
          )}
        </HStack>

        {/* Divider */}
        <Divider borderColor={borderColor} />

        {/* Content */}
        <Box>
          {children}
        </Box>
      </VStack>

      {/* Subtle gradient overlay for depth */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="1px"
        bgGradient="linear(to-r, transparent, brand.200, transparent)"
        opacity={0.5}
      />
    </Box>
  )
}

export default EnterpriseCard
