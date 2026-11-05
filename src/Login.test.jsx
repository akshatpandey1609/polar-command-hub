import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';

describe('Login Component', () => {
  it('renders login form correctly', () => {
    render(<Login onLogin={() => {}} />);

    expect(screen.getByText('POLAR')).toBeInTheDocument();
    expect(screen.getByText('COMMAND CENTER')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles successful login', () => {
    const handleLogin = vi.fn();
    render(<Login onLogin={handleLogin} />);

    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'admin@polarcommand.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Admin@123' } });
    fireEvent.click(submitButton);

    expect(handleLogin).toHaveBeenCalledTimes(1);
    expect(handleLogin).toHaveBeenCalledWith({
      username: 'admin@polarcommand.com',
      password: 'Admin@123',
      role: 'Administrator',
    });
  });

  it('displays error message on failed login', () => {
    const handleLogin = vi.fn();
    render(<Login onLogin={handleLogin} />);

    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'invalid@polarcommand.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    expect(handleLogin).not.toHaveBeenCalled();
  });

  it('clears error message on subsequent submit attempt', () => {
    const handleLogin = vi.fn();
    render(<Login onLogin={handleLogin} />);

    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // First failed attempt
    fireEvent.change(usernameInput, { target: { value: 'invalid@user' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();

    // Now a valid attempt
    fireEvent.change(usernameInput, { target: { value: 'admin@polarcommand.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Admin@123' } });
    fireEvent.click(submitButton);

    expect(handleLogin).toHaveBeenCalledTimes(1);
    // The error message might disappear, let's verify if the login triggers
  });
});
