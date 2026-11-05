import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, describe, beforeEach, afterEach, vi } from 'vitest';
import App from './App.jsx';

// Mock matchMedia if necessary, though jsdom might have it.
beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App Component', () => {
  test('renders Login component initially when no user is logged in', () => {
    render(<App />);
    expect(screen.getByText('SECURE ACCESS')).toBeInTheDocument();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  test('logs in, renders Dashboard, and handles sidebar navigation and logout', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Login
    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitBtn = screen.getByRole('button', { name: /SIGN IN/i });

    await user.type(usernameInput, 'admin@polarcommand.com');
    await user.type(passwordInput, 'Admin@123');
    await user.click(submitBtn);

    // Verify Dashboard renders
    expect(screen.getByText('Expedition Command Dashboard')).toBeInTheDocument();

    // Sidebar should be visible
    expect(screen.getByText('● SYSTEM OPERATIONAL')).toBeInTheDocument();

    // Test navigation: Expeditions
    const expeditionsNavBtn = screen.getByRole('button', { name: 'Expeditions' });
    await user.click(expeditionsNavBtn);
    expect(screen.getByText('Expedition Management')).toBeInTheDocument();
    expect(screen.getByText('All Expeditions')).toBeInTheDocument();

    // Test navigation: Route Planning
    const routePlanningNavBtn = screen.getByRole('button', { name: 'Route Planning' });
    await user.click(routePlanningNavBtn);
    expect(screen.getAllByText('Route Planning').length).toBeGreaterThan(0);
    expect(screen.getByText('Saved Routes')).toBeInTheDocument();

    // Test navigation: Cargo & Logistics
    const cargoNavBtn = screen.getByRole('button', { name: 'Cargo & Logistics' });
    await user.click(cargoNavBtn);
    expect(screen.getAllByText('Cargo & Logistics').length).toBeGreaterThan(0);
    expect(screen.getByText('Cargo Records')).toBeInTheDocument();

    // Test logout
    const logoutBtn = screen.getByRole('button', { name: 'Logout' });
    await user.click(logoutBtn);

    // Verify back to login
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });
});
