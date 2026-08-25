import { useContext } from 'react';
import { ProgressContext } from '../context/ProgressContext.jsx';

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error('useProgress має викликатися всередині <ProgressProvider>');
  }

  return context;
}
