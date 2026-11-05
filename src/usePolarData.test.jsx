import { renderHook, act } from '@testing-library/react';
import { usePolarData } from './App.jsx.jsx';

describe('usePolarData', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with fallback if localStorage is empty', () => {
    const { result } = renderHook(() => usePolarData('test-key', ['default']));
    expect(result.current).toEqual(['default']);
  });

  it('should initialize with value from localStorage if it exists', () => {
    localStorage.setItem('test-key', JSON.stringify({ a: 1 }));
    const { result } = renderHook(() => usePolarData('test-key', []));
    expect(result.current).toEqual({ a: 1 });
  });

  it('should return fallback if localStorage has invalid JSON', () => {
    localStorage.setItem('test-key', 'invalid json {');
    const { result } = renderHook(() => usePolarData('test-key', ['default']));
    expect(result.current).toEqual(['default']);
  });

  it('should update state when polar-data-change event is fired', () => {
    const { result } = renderHook(() => usePolarData('test-key', []));

    act(() => {
      localStorage.setItem('test-key', JSON.stringify([1, 2, 3]));
      window.dispatchEvent(new Event('polar-data-change'));
    });

    expect(result.current).toEqual([1, 2, 3]);
  });

  it('should update state when storage event is fired', () => {
    const { result } = renderHook(() => usePolarData('test-key', []));

    act(() => {
      localStorage.setItem('test-key', JSON.stringify(['sync']));
      window.dispatchEvent(new Event('storage'));
    });

    expect(result.current).toEqual(['sync']);
  });

  it('should remove event listeners on unmount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => usePolarData('test-key', []));

    expect(addEventListenerSpy).toHaveBeenCalledWith('polar-data-change', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('polar-data-change', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
