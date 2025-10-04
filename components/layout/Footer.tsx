'use client';

import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export function Footer(): JSX.Element {
  return (
    <Box as="footer" bg="gray.100" py={4} px={6} mt="auto">
      <Text fontSize="sm" color="gray.600" textAlign="center">
        © {new Date().getFullYear()} OpenSciEd Lesson Repository
      </Text>
    </Box>
  );
}
