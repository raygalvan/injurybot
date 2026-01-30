
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ib_demo_mode_enabled';

export const useDemoMode = () => {
  const [demoModeEnabled, setDemoModeEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    // If null, default to true. Otherwise, check if it's 'true'.
    return saved === null ? true : saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(demoModeEnabled));
  }, [demoModeEnabled]);

  return {
    demoModeEnabled,
    setDemoModeEnabled
  };
};
