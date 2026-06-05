import { useState, useEffect, useCallback } from 'react';

const generateStats = (stationId, parameters) => {
  const stats = {};
  parameters.forEach(param => {
    let base, range;
    switch (param) {
      case 'temp': base = 19; range = 3; break;
      case 'turbidity': base = 8; range = 6; break;
      case 'do': base = 8.5; range = 1.5; break;
      case 'ph': base = 7.5; range = 0.4; break;
      case 'conductivity': base = 500; range = 200; break;
      case 'salinity': base = 0.8; range = 0.5; break;
      case 'depth': base = 7; range = 2; break;
      case 'speed': base = 1.2; range = 0.6; break;
      case 'wind_speed': base = 5; range = 3; break;
      case 'air_temp': base = 23; range = 5; break;
      case 'pressure': base = 1015; range = 10; break;
      default: base = 10; range = 2;
    }
    const seed = stationId ? stationId.charCodeAt(0) : 0;
    const min = base - range + (seed % 10) * 0.1;
    const max = base + range + (seed % 10) * 0.1;
    const avg = (min + max) / 2;
    stats[param] = {
      avg: parseFloat(avg.toFixed(2)),
      min: parseFloat(min.toFixed(2)),
      max: parseFloat(max.toFixed(2)),
      count: 24,
    };
  });
  return stats;
};

export const useStats = (stationId, parameters = []) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!stationId || parameters.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      await new Promise(r => setTimeout(r, 500));
      const stats = generateStats(stationId, parameters);
      setData(stats);
    } catch (err) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }, [stationId, parameters]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, loading, error, refetch: fetchStats };
};
