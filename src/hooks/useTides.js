import { useState, useEffect, useCallback } from 'react';

const generateTideData = () => {
  const now = Date.now();
  const cycleMs = 12.42 * 60 * 60 * 1000; // Semi-diurnal tidal cycle
  const progress = (now % cycleMs) / cycleMs;
  const height = 1.0 + 0.9 * Math.sin(progress * Math.PI * 2 - Math.PI / 2);

  let phase;
  if (progress > 0.45 && progress < 0.55) phase = 'high';
  else if (progress > 0.95 || progress < 0.05) phase = 'low';
  else if (progress > 0.05 && progress < 0.45) phase = 'rising';
  else phase = 'falling';

  const nextEvent = phase === 'rising'
    ? { type: 'High', time: new Date(now + (0.5 - progress) * cycleMs).toISOString() }
    : phase === 'falling'
    ? { type: 'Low', time: new Date(now + (1.0 - progress) * cycleMs).toISOString() }
    : phase === 'high'
    ? { type: 'Low', time: new Date(now + (0.75 - (progress > 0.5 ? progress - 0.5 : progress + 0.5)) * cycleMs).toISOString() }
    : { type: 'High', time: new Date(now + (0.25 - progress) * cycleMs).toISOString() };

  const predictions = [];
  for (let i = -12; i <= 24; i += 0.5) {
    const t = now + i * 60 * 60 * 1000;
    const p = ((t % cycleMs) + cycleMs) % cycleMs / cycleMs;
    const h = 1.0 + 0.9 * Math.sin(p * Math.PI * 2 - Math.PI / 2);
    predictions.push({
      timestamp: new Date(t).toISOString(),
      height: parseFloat(h.toFixed(2)),
    });
  }

  return {
    current: {
      height: parseFloat(height.toFixed(2)),
      phase,
      timestamp: new Date().toISOString(),
    },
    nextEvent,
    predictions,
  };
};

export const useTides = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(r => setTimeout(r, 500));
      setData(generateTideData());
    } catch (err) {
      setError(err.message || 'Failed to load tide data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
