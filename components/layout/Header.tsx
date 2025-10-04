'use client';

import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

export function Header(): JSX.Element {
  return (
    <Box as="header" bg="brand.primary" color="white" py={4} px={6}>
      <Heading size="lg">OpenSciEd Lesson Repository</Heading>
    </Box>
  );
}
