import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RootLayout from './layout';

describe('RootLayout', () => {
  it('should render children content', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render Header with app title', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    expect(screen.getByText('OpenSciEd Lesson Repository')).toBeInTheDocument();
  });

  it('should render Footer with copyright', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  it('should have semantic HTML structure', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('should apply flex layout for full-height page', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    const body = container.querySelector('body');
    expect(body).toHaveStyle({ display: 'flex', flexDirection: 'column' });
  });
});
