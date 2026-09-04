import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDraftStorage } from '../useDraftStorage';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('useDraftStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return default value when localStorage is empty', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => 
      useDraftStorage('test-key', { name: 'default' })
    );
    
    expect(result.current[0]).toEqual({ name: 'default' });
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
  });

  it('should return parsed value from localStorage', () => {
    const storedValue = { name: 'stored', count: 42 };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedValue));
    
    const { result } = renderHook(() => 
      useDraftStorage('test-key', { name: 'default' })
    );
    
    expect(result.current[0]).toEqual(storedValue);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
  });

  it('should return default value when localStorage contains invalid JSON', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json');
    
    const { result } = renderHook(() => 
      useDraftStorage('test-key', { name: 'default' })
    );
    
    expect(result.current[0]).toEqual({ name: 'default' });
  });

  it('should save value to localStorage when setValue is called', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => 
      useDraftStorage('test-key', { name: 'default' })
    );
    
    const newValue = { name: 'updated', count: 10 };
    
    act(() => {
      result.current[1](newValue);
    });
    
    expect(result.current[0]).toEqual(newValue);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'test-key', 
      JSON.stringify(newValue)
    );
  });

  it('should handle function updates', () => {
    const initialValue = { count: 0 };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialValue));
    
    const { result } = renderHook(() => 
      useDraftStorage('test-key', initialValue)
    );
    
    act(() => {
      result.current[1](prev => ({ ...prev, count: prev.count + 1 }));
    });
    
    expect(result.current[0]).toEqual({ count: 1 });
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'test-key', 
      JSON.stringify({ count: 1 })
    );
  });

  it('should handle localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });
    
    // Mock console.warn to avoid test output noise
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const { result } = renderHook(() => 
      useDraftStorage('test-key', { name: 'default' })
    );
    
    act(() => {
      result.current[1]({ name: 'new value' });
    });
    
    // Should still update the state even if localStorage fails
    expect(result.current[0]).toEqual({ name: 'new value' });
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error saving to localStorage:', 
      expect.any(Error)
    );
    
    consoleSpy.mockRestore();
  });

  it('should handle storage events', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ name: 'initial' }));
    
    const { result } = renderHook(() => 
      useDraftStorage('test-key', { name: 'default' })
    );
    
    expect(result.current[0]).toEqual({ name: 'initial' });
    
    // Simulate storage event
    const storageEvent = new StorageEvent('storage', {
      key: 'test-key',
      newValue: JSON.stringify({ name: 'updated from another tab' })
    });
    
    act(() => {
      window.dispatchEvent(storageEvent);
    });
    
    expect(result.current[0]).toEqual({ name: 'updated from another tab' });
  });

  it('should ignore storage events for different keys', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ name: 'initial' }));
    
    const { result } = renderHook(() => 
      useDraftStorage('test-key', { name: 'default' })
    );
    
    // Simulate storage event for different key
    const storageEvent = new StorageEvent('storage', {
      key: 'other-key',
      newValue: JSON.stringify({ name: 'other value' })
    });
    
    act(() => {
      window.dispatchEvent(storageEvent);
    });
    
    // Should not change the value
    expect(result.current[0]).toEqual({ name: 'initial' });
  });

  it('should ignore storage events with invalid JSON', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ name: 'initial' }));
    
    const { result } = renderHook(() => 
      useDraftStorage('test-key', { name: 'default' })
    );
    
    // Simulate storage event with invalid JSON
    const storageEvent = new StorageEvent('storage', {
      key: 'test-key',
      newValue: 'invalid json'
    });
    
    act(() => {
      window.dispatchEvent(storageEvent);
    });
    
    // Should not change the value
    expect(result.current[0]).toEqual({ name: 'initial' });
  });

  it('should clean up event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    
    const { unmount } = renderHook(() => 
      useDraftStorage('test-key', { name: 'default' })
    );
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'storage', 
      expect.any(Function)
    );
    
    removeEventListenerSpy.mockRestore();
  });

  it('should work with different data types', () => {
    // Test with array
    const { result: arrayResult } = renderHook(() => 
      useDraftStorage('array-key', [])
    );
    
    act(() => {
      arrayResult.current[1]([1, 2, 3]);
    });
    
    expect(arrayResult.current[0]).toEqual([1, 2, 3]);
    
    // Test with number
    const { result: numberResult } = renderHook(() => 
      useDraftStorage('number-key', 0)
    );
    
    act(() => {
      numberResult.current[1](42);
    });
    
    expect(numberResult.current[0]).toBe(42);
    
    // Test with string
    const { result: stringResult } = renderHook(() => 
      useDraftStorage('string-key', '')
    );
    
    act(() => {
      stringResult.current[1]('hello');
    });
    
    expect(stringResult.current[0]).toBe('hello');
  });
});