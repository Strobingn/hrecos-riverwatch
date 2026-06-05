import { useState, useEffect, useCallback, useRef } from 'react';
import { STATIONS, getWQILevel } from '../constants';

const generateMockData = () => {
  const liveStations = STATIONS.filter(s => s.status === 'live');
  const stationsOnline = liveStations.length;
  const totalStations = STATIONS.length;

  // Avg water temp from live stations
  const temps = liveStations.map(() => 15 + Math.random() * 10);
  const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);

  // Mock tide
  const tideHeight = (1.2 + Math.sin(Date.now() / 3600000) * 0.8).toFixed(2);
  const tidePhase = tideHeight > 1.5 ? 'high' : tideHeight < 0.5 ? 'low' : Math.sin(Date.now() / 3600000) > 0 ? 'rising' : 'falling';

  // WQI
  const wqi = Math.round(30 + Math.random() * 30);
  const wqiLevel = getWQILevel(wqi);

  return {
    stationsOnline,
    totalStations,
    avgWaterTemp: avgTemp,
    currentTide: {
      height: parseFloat(tideHeight),
      phase: tidePhase,
    },
    waterQualityIndex: wqi,
    waterQualityLevel: wqiLevel,
    lastUpdated: new Date().toISOString(),
  };
};

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API delay
      await new Promise(r => setTimeout(r, 800));
      const result = generateMockData();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 5 * 60 * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
