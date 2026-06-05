import { useState, useEffect, useCallback } from 'react';

const generateHistoricalData = (parameter, hours, stationId) => {
  const points = [];
  const now = Date.now();
  const interval = hours <= 6 ? 10 * 60 * 1000 : hours <= 24 ? 60 * 60 * 1000 : 6 * 60 * 60 * 1000;
  const count = Math.floor((hours * 60 * 60 * 1000) / interval);

  let baseValue;
  switch (parameter) {
    case 'temp': baseValue = 18; break;
    case 'turbidity': baseValue = 8; break;
    case 'do': baseValue = 8.5; break;
    case 'ph': baseValue = 7.4; break;
    case 'conductivity': baseValue = 450; break;
    case 'salinity': baseValue = 0.5; break;
    case 'depth': baseValue = 6; break;
    case 'speed': baseValue = 1.0; break;
    case 'wind_speed': baseValue = 5; break;
    case 'air_temp': baseValue = 22; break;
    case 'pressure': baseValue = 1013; break;
    default: baseValue = 10;
  }

  const seed = stationId ? stationId.charCodeAt(0) : 0;
  for (let i = 0; i < count; i++) {
    const t = now - (count - i) * interval;
    const hourOfDay = new Date(t).getHours();
    const dailyCycle = Math.sin((hourOfDay - 6) * Math.PI / 12) * 0.3;
    const noise = (Math.sin(i * 0.5 + seed) * 0.4 + Math.cos(i * 0.3) * 0.3) * baseValue * 0.1;
    const trend = (i / count) * baseValue * 0.05;
    const value = baseValue + dailyCycle * baseValue * 0.15 + noise + trend;

    points.push({
      timestamp: new Date(t).toISOString(),
      value: parseFloat(value.toFixed(2)),
    });
  }
  return points;
};

export const useHistorical = (stationId, hours = 24) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!stationId) return;
    try {
      setLoading(true);
      setError(null);
      await new Promise(r => setTimeout(r, 700));
      // Generate for all parameters
      const allData = {};
      const params = ['temp', 'turbidity', 'do', 'ph', 'conductivity', 'salinity', 'depth', 'speed', 'wind_speed', 'air_temp', 'pressure'];
      params.forEach(param => {
        allData[param] = generateHistoricalData(param, hours, stationId);
      });
      setData(allData);
    } catch (err) {
      setError(err.message || 'Failed to load historical data');
    } finally {
      setLoading(false);
    }
  }, [stationId, hours]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
