import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import LoginPage from './page';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', (): { useRouter: () => { push: typeof mockPush } } => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Wrapper component for Chakra UI
function Wrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return <ChakraProvider>{children}</ChakraProvider>;
}

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('should render username input field (1.5-UNIT-001)', () => {
    render(<LoginPage />, { wrapper: Wrapper });
    const usernameInput = screen.getByLabelText(/username/i);
    expect(usernameInput).toBeDefined();
  });

  it('should render password input field (1.5-UNIT-002)', () => {
    render(<LoginPage />, { wrapper: Wrapper });
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeDefined();
  });

  it('should have password field with type="password" (1.5-UNIT-003)', () => {
    render(<LoginPage />, { wrapper: Wrapper });
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput.getAttribute('type')).toBe('password');
  });

  it('should render login form with proper labels for accessibility (1.5-INT-002)', () => {
    render(<LoginPage />, { wrapper: Wrapper });

    // Verify labels are properly associated with inputs using htmlFor
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(usernameInput).toBeDefined();
    expect(passwordInput).toBeDefined();
  });

  it('should call login API on form submission with valid credentials', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { token: 'mock-token', user: { id: '1', username: 'teacher' } },
          }),
      })
    ) as unknown as typeof fetch;

    render(<LoginPage />, { wrapper: Wrapper });

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });

    fireEvent.change(usernameInput, { target: { value: 'teacher' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'teacher', password: 'password123' }),
        })
      );
    });
  });

  it('should display error message for invalid credentials (1.5-INT-038)', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid username or password' }),
      })
    ) as unknown as typeof fetch;

    render(<LoginPage />, { wrapper: Wrapper });

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });

    fireEvent.change(usernameInput, { target: { value: 'wrong' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText('Invalid username or password');
      expect(errorMessage).toBeDefined();
    });
  });

  it('should redirect to home page on successful login (1.5-INT-039)', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { token: 'mock-token', user: { id: '1', username: 'teacher' } },
          }),
      })
    ) as unknown as typeof fetch;

    render(<LoginPage />, { wrapper: Wrapper });

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });

    fireEvent.change(usernameInput, { target: { value: 'teacher' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should show loading state while submitting', async () => {
    let resolvePromise: (value: Response) => void;
    const promise = new Promise<Response>((resolve) => {
      resolvePromise = resolve;
    });

    global.fetch = vi.fn(() => promise) as unknown as typeof fetch;

    render(<LoginPage />, { wrapper: Wrapper });

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });

    fireEvent.change(usernameInput, { target: { value: 'teacher' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/logging in/i)).toBeDefined();
    });

    // Resolve promise to clean up
    resolvePromise!(
      new Response(JSON.stringify({ data: { token: 'token', user: {} } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });
});
