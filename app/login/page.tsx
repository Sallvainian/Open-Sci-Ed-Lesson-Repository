'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Heading,
  Text,
  VStack,
  Container,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      setError('');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
        return;
      }

      // Authentication successful, redirect to home
      router.push('/');
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Container maxW="container.sm" py={12}>
      <Box maxW="md" mx="auto" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center">
            Login
          </Heading>

          <Text fontSize="sm" color="gray.600" textAlign="center">
            Welcome to OpenSciEd Lesson Repository
          </Text>

          {error && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {error}
            </Text>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.username}>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id="username"
                  {...register('username')}
                  type="text"
                  placeholder="Enter your username"
                />
                <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  {...register('password')}
                  type="password"
                  placeholder="Enter your password"
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isSubmitting}
                loadingText="Logging in..."
              >
                Log In
              </Button>
            </VStack>
          </form>

          <Text fontSize="xs" color="gray.500" textAlign="center">
            Default credentials: teacher / password123
          </Text>
        </VStack>
      </Box>
    </Container>
  );
}
