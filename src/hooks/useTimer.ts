import { useEffect, useState, useRef } from 'react';

interface TimerOptions {
  sessionId: string;
  hoursPerDay: number;
  onComplete?: () => void;
}

export const useTimer = ({ sessionId, hoursPerDay, onComplete }: TimerOptions) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`timer-${sessionId}`);
    if (saved) {
      const { elapsed: savedElapsed, isRunning: savedRunning } = JSON.parse(saved);
      setElapsed(savedElapsed || 0);
      setIsRunning(savedRunning || false);
    }
  }, [sessionId]);

  // Persist changes
  useEffect(() => {
    localStorage.setItem(
      `timer-${sessionId}`,
      JSON.stringify({ elapsed, isRunning })
    );

    if (elapsed >= hoursPerDay * 3600) {
      stop();
      if (onComplete) onComplete();
    }
  }, [elapsed, isRunning, hoursPerDay, sessionId, onComplete]);

  // Tick interval
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setElapsed(0);
    setIsRunning(false);
    localStorage.removeItem(`timer-${sessionId}`);
  };

  return { isRunning, elapsed, start, stop, reset };
};
