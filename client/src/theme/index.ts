import { extendTheme } from '@chakra-ui/react'

// Enterprise-grade theme for medical aftercare application
const theme = extendTheme({
  colors: {
    // Primary brand colors - Professional medical blue
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    // Medical status colors
    medical: {
      emergency: '#dc2626',
      warning: '#ea580c',
      info: '#0284c7',
      success: '#059669',
      critical: '#991b1b',
    },
    // Neutral grays for enterprise feel
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    // Semantic colors
    semantic: {
      background: '#ffffff',
      surface: '#f8fafc',
      border: '#e2e8f0',
      text: {
        primary: '#0f172a',
        secondary: '#475569',
        muted: '#64748b',
      }
    }
  },
  fonts: {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, "Liberation Mono", Menlo, Courier, monospace',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  space: {
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
        size: 'md',
      },
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'lg',
        _focus: {
          boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.12)',
          outline: 'none',
        },
      },
      variants: {
        solid: {
          bg: 'brand.600',
          color: 'white',
          _hover: {
            bg: 'brand.700',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'brand.800',
            transform: 'translateY(0)',
          },
        },
        outline: {
          borderColor: 'brand.600',
          color: 'brand.600',
          _hover: {
            bg: 'brand.50',
            borderColor: 'brand.700',
          },
        },
        ghost: {
          color: 'brand.600',
          _hover: {
            bg: 'brand.50',
          },
        },
        // Enterprise-specific variants
        primary: {
          bg: 'brand.600',
          color: 'white',
          _hover: {
            bg: 'brand.700',
          },
        },
        secondary: {
          bg: 'gray.100',
          color: 'gray.700',
          _hover: {
            bg: 'gray.200',
          },
        },
        danger: {
          bg: 'medical.emergency',
          color: 'white',
          _hover: {
            bg: 'red.700',
          },
        },
      },
      sizes: {
        sm: {
          h: '8',
          px: '3',
          fontSize: 'sm',
        },
        md: {
          h: '10',
          px: '4',
          fontSize: 'md',
        },
        lg: {
          h: '12',
          px: '6',
          fontSize: 'lg',
        },
      },
    },
    Checkbox: {
      defaultProps: {
        colorScheme: 'brand',
        size: 'md',
      },
      baseStyle: {
        control: {
          borderRadius: 'md',
          borderWidth: '2px',
          _focus: {
            boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.12)',
          },
          _checked: {
            bg: 'brand.600',
            borderColor: 'brand.600',
            _hover: {
              bg: 'brand.700',
              borderColor: 'brand.700',
            },
          },
        },
        label: {
          fontWeight: '500',
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'white',
          borderRadius: 'xl',
          border: '1px solid',
          borderColor: 'gray.200',
          boxShadow: 'sm',
          _hover: {
            boxShadow: 'md',
          },
        },
        header: {
          pb: '4',
        },
        body: {
          py: '6',
        },
        footer: {
          pt: '4',
        },
      },
      variants: {
        elevated: {
          container: {
            boxShadow: 'lg',
            border: 'none',
          },
        },
        outline: {
          container: {
            bg: 'transparent',
            borderWidth: '2px',
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'lg',
          borderWidth: '2px',
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.12)',
          },
          _invalid: {
            borderColor: 'medical.emergency',
            boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.12)',
          },
        },
      },
      variants: {
        filled: {
          field: {
            bg: 'gray.50',
            _hover: {
              bg: 'gray.100',
            },
            _focus: {
              bg: 'white',
              borderColor: 'brand.500',
            },
          },
        },
      },
    },
    Textarea: {
      baseStyle: {
        borderRadius: 'lg',
        borderWidth: '2px',
        _focus: {
          borderColor: 'brand.500',
          boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.12)',
        },
        _invalid: {
          borderColor: 'medical.emergency',
          boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.12)',
        },
      },
      variants: {
        filled: {
          bg: 'gray.50',
          _hover: {
            bg: 'gray.100',
          },
          _focus: {
            bg: 'white',
            borderColor: 'brand.500',
          },
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          borderRadius: 'lg',
          borderWidth: '2px',
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.12)',
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight: '600',
        fontSize: 'xs',
        textTransform: 'uppercase',
        letterSpacing: 'wider',
      },
      variants: {
        solid: {
          bg: 'brand.600',
          color: 'white',
        },
        subtle: {
          bg: 'brand.100',
          color: 'brand.800',
        },
        outline: {
          borderWidth: '2px',
          borderColor: 'brand.600',
          color: 'brand.600',
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: '700',
        lineHeight: '1.2',
        letterSpacing: '-0.025em',
      },
      sizes: {
        xs: {
          fontSize: 'sm',
          fontWeight: '600',
        },
        sm: {
          fontSize: 'md',
          fontWeight: '600',
        },
        md: {
          fontSize: 'lg',
          fontWeight: '700',
        },
        lg: {
          fontSize: 'xl',
          fontWeight: '700',
        },
        xl: {
          fontSize: '2xl',
          fontWeight: '800',
        },
        '2xl': {
          fontSize: '3xl',
          fontWeight: '800',
        },
      },
    },
    Text: {
      baseStyle: {
        lineHeight: '1.6',
        color: 'semantic.text.primary',
      },
      variants: {
        secondary: {
          color: 'semantic.text.secondary',
        },
        muted: {
          color: 'semantic.text.muted',
        },
        caption: {
          fontSize: 'sm',
          color: 'semantic.text.muted',
          fontWeight: '500',
        },
      },
    },
    Alert: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          borderWidth: '1px',
        },
      },
      variants: {
        solid: {
          container: {
            bg: 'brand.600',
            color: 'white',
          },
        },
        'left-accent': {
          container: {
            borderLeftWidth: '4px',
            borderLeftColor: 'brand.600',
            bg: 'brand.50',
          },
        },
        'top-accent': {
          container: {
            borderTopWidth: '4px',
            borderTopColor: 'brand.600',
            bg: 'brand.50',
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'semantic.surface',
        color: 'semantic.text.primary',
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      },
      '*': {
        boxSizing: 'border-box',
      },
      '*:focus': {
        outline: 'none',
      },
      // Custom scrollbar
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        bg: 'gray.100',
      },
      '::-webkit-scrollbar-thumb': {
        bg: 'gray.300',
        borderRadius: 'full',
      },
      '::-webkit-scrollbar-thumb:hover': {
        bg: 'gray.400',
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
})

export default theme
