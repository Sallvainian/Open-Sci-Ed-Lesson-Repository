'use client';

import React, { useState } from 'react';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export function Header(): JSX.Element {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (): Promise<void> => {
    try {
      setIsLoggingOut(true);
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      // Redirect to login page after successful logout
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Box as="header" bg="brand.primary" color="white" py={4} px={6}>
      <Flex justify="space-between" align="center">
        <Heading size="lg">OpenSciEd Lesson Repository</Heading>
        <Button
          variant="outline"
          colorScheme="whiteAlpha"
          onClick={handleLogout}
          isLoading={isLoggingOut}
          loadingText="Logging out..."
          size="sm"
        >
          Logout
        </Button>
      </Flex>
    </Box>
  );
}
