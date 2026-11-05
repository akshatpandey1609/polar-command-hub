import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { writePolar } from './App.jsx.jsx';

describe('writePolar', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(window, 'dispatchEvent');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should write data to localStorage and dispatch event', () => {
    const key = 'test-key';
    const value = { data: 'test-value' };

    writePolar(key, value);

    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));

    // Test that the event was dispatched
    expect(window.dispatchEvent).toHaveBeenCalled();
    const dispatchedEvent = vi.mocked(window.dispatchEvent).mock.calls[0][0];
    expect(dispatchedEvent.type).toBe('polar-data-change');
  });
});
