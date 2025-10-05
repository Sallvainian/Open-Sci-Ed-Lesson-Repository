import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from './page';

describe('HomePage', () => {
  it('should display welcome message', () => {
    render(<HomePage />);

    expect(screen.getByText('Welcome to OpenSciEd Lesson Repository')).toBeInTheDocument();
  });

  it('should display description', () => {
    render(<HomePage />);

    expect(screen.getByText('Organize your OpenSciEd science lessons')).toBeInTheDocument();
  });

  it('should render as a heading element', () => {
    render(<HomePage />);

    const heading = screen.getByRole('heading', {
      name: /Welcome to OpenSciEd Lesson Repository/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('should have proper text hierarchy', () => {
    const { container } = render(<HomePage />);

    const heading = container.querySelector('h1');
    const description = screen.getByText('Organize your OpenSciEd science lessons');

    expect(heading).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });
});
