// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Load state from localStorage or use initialValue
  const loadFromStorage = () => {
    const savedValue = localStorage.getItem(key);
    if (savedValue) {
      try {
        return JSON.parse(savedValue);
      } catch (error) {
        console.error(`Error parsing saved value for key ${key}:`, error);
        return initialValue;
      }
    }
    return initialValue;
  };

  const [storedValue, setStoredValue] = useState(loadFromStorage);

  // Update localStorage when the state changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return { storedValue, setValue: setStoredValue };
}

export default useLocalStorage;