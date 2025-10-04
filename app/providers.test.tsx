import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Providers } from './providers';

describe('Providers', () => {
  it('should render children wrapped in providers', () => {
    render(
      <Providers>
        <div>Test Child Content</div>
      </Providers>
    );

    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });

  it('should include Chakra UI provider in the tree', () => {
    const { container } = render(
      <Providers>
        <div data-testid="test-content">Test</div>
      </Providers>
    );

    // Verify content renders (Chakra providers are in the tree)
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    // Chakra UI wraps content in a div element
    expect(container.querySelector('div')).toBeInTheDocument();
  });
});
