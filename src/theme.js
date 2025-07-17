// theme.ts
import { defineConfig, extendTheme, ThemeConfig } from '@chakra-ui/react'

const colorModeConfig = {
  initialColorMode: 'light',        // or 'dark' if you prefer
  useSystemColorMode: true,         // syncs with OS theme
}

const customTheme = defineConfig({
  config: colorModeConfig,
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      500: '#3b82f6',
      600: '#2563eb',
    },
  },
  fonts: {
    heading: 'Inter, -apple-system, sans-serif',
    body: 'Inter, -apple-system, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'lg',
      },
      sizes: {
        lg: {
          h: '48px',
          fontSize: 'lg',
          px: '32px',
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'lg',
        },
      },
    },
  },
})

// Export final theme object
export default customTheme
