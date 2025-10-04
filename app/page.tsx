'use client';

import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

export default function HomePage(): JSX.Element {
  return (
    <Box>
      <Heading as="h1" size="2xl" mb={4}>
        Welcome to OpenSciEd Lesson Repository
      </Heading>
      <Text fontSize="lg" color="gray.600">
        Organize your OpenSciEd science lessons
      </Text>
    </Box>
  );
}
