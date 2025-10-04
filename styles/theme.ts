import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      primary: '#3182CE', // Blue
      secondary: '#38B2AC', // Teal
      background: '#F7FAFC', // Light gray
    },
  },
  fonts: {
    heading: 'system-ui, sans-serif',
    body: 'system-ui, sans-serif',
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
});

export default theme;
