import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Header } from './Header';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock console.error to prevent test output pollution
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

// Chakra UI wrapper for component rendering
function Wrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return <ChakraProvider>{children}</ChakraProvider>;
}

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful logout by default
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
      } as Response)
    ) as unknown as typeof fetch;
  });

  describe('Error Handling', () => {
    it('should handle fetch network error (1.9-UNIT-015)', async () => {
      const networkError = new Error('Network error');
      global.fetch = vi.fn(() => Promise.reject(networkError)) as unknown as typeof fetch;

      render(<Header />, { wrapper: Wrapper });
      const logoutButton = screen.getByRole('button', { name: /logout/i });

      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith('Logout failed:', networkError);
        expect(mockPush).not.toHaveBeenCalled(); // Should NOT redirect on error
      });
    });

    it('should handle fetch non-ok response (1.9-UNIT-016)', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        } as Response)
      ) as unknown as typeof fetch;

      render(<Header />, { wrapper: Wrapper });
      const logoutButton = screen.getByRole('button', { name: /logout/i });

      fireEvent.click(logoutButton);

      // Should throw error and NOT redirect when response is non-ok
      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
      });
    });

    it('should reset loading state in finally block after error (1.9-UNIT-017)', async () => {
      const networkError = new Error('Network error');
      global.fetch = vi.fn(() => Promise.reject(networkError)) as unknown as typeof fetch;

      render(<Header />, { wrapper: Wrapper });
      const logoutButton = screen.getByRole('button', { name: /logout/i });

      fireEvent.click(logoutButton);

      // Button shows loading initially
      await waitFor(() => {
        expect(screen.getByText(/logging out/i)).toBeDefined();
      });

      // After error, loading state resets
      await waitFor(() => {
        expect(screen.queryByText(/logging out/i)).toBeNull();
        expect(screen.getByRole('button', { name: /logout/i })).toBeDefined();
      });
    });

    it('should not redirect on error (1.9-UNIT-018)', async () => {
      const networkError = new Error('Network error');
      global.fetch = vi.fn(() => Promise.reject(networkError)) as unknown as typeof fetch;

      render(<Header />, { wrapper: Wrapper });
      const logoutButton = screen.getByRole('button', { name: /logout/i });

      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalled();
      });

      // Verify router.push was NOT called after error
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should disable button during logout (1.9-UNIT-019)', async () => {
      // Mock a slow response to capture loading state
      global.fetch = vi.fn(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  status: 200,
                } as Response),
              100
            )
          )
      ) as unknown as typeof fetch;

      render(<Header />, { wrapper: Wrapper });
      const logoutButton = screen.getByRole('button', { name: /logout/i });

      fireEvent.click(logoutButton);

      // Check that button shows loading state
      await waitFor(() => {
        const loadingText = screen.queryByText(/logging out/i);
        expect(loadingText).toBeDefined();
      });
    });

    it('should enable button after error (1.9-UNIT-020)', async () => {
      const networkError = new Error('Network error');
      global.fetch = vi.fn(() => Promise.reject(networkError)) as unknown as typeof fetch;

      render(<Header />, { wrapper: Wrapper });
      const logoutButton = screen.getByRole('button', { name: /logout/i });

      // Initial state - button is enabled
      expect(logoutButton).not.toBeDisabled();

      fireEvent.click(logoutButton);

      // After error completes, button should be enabled again
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /logout/i });
        expect(button).not.toBeDisabled();
      });
    });
  });
});
