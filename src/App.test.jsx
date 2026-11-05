import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readPolar } from './App.jsx.jsx';

describe('readPolar', () => {
  beforeEach(() => {
    // Clear the localStorage before each test
    localStorage.clear();
    // Clear mocks
    vi.restoreAllMocks();
  });

  it('returns parsed JSON data from localStorage if it exists and is valid', () => {
    const key = 'testKey';
    const mockData = { id: 1, name: 'Test' };
    localStorage.setItem(key, JSON.stringify(mockData));

    const result = readPolar(key);
    expect(result).toEqual(mockData);
  });

  it('returns the fallback if the key does not exist in localStorage', () => {
    const key = 'nonExistentKey';
    const fallback = { fallback: true };

    const result = readPolar(key, fallback);
    expect(result).toEqual(fallback);
  });

  it('returns default empty array fallback if the key does not exist and no fallback is provided', () => {
    const key = 'nonExistentKey';

    const result = readPolar(key);
    expect(result).toEqual([]);
  });

  it('returns the fallback if JSON.parse throws an error (invalid JSON in localStorage)', () => {
    const key = 'errorKey';
    const invalidJson = '{"id": 1, "name": "Test"'; // missing closing brace
    localStorage.setItem(key, invalidJson);
    const fallback = { fallback: true };

    const result = readPolar(key, fallback);
    expect(result).toEqual(fallback);
  });
});
