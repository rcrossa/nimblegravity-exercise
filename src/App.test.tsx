import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders the header and main layout', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Nimble Gravity Challenge')).toBeInTheDocument();
  });

  it('renders EmailLogin by default on root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Candidate Login')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue to Jobs/i })).toBeInTheDocument();
  });
});
