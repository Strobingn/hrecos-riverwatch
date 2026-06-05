import { useState, useEffect, useCallback } from 'react';
import { STATIONS, PARAM_INFO } from '../constants';

const generateReadings = (station) => {
  const readings = {};
  station.parameters.forEach(param => {
    const info = PARAM_INFO[param];
    if (!info) return;
    let value;
    switch (param) {
      case 'temp': value = (15 + Math.random() * 10).toFixed(1); break;
      case 'turbidity': value = (2 + Math.random() * 15).toFixed(1); break;
      case 'do': value = (6 + Math.random() * 4).toFixed(1); break;
      case 'ph': value = (7.0 + Math.random() * 1.0).toFixed(1); break;
      case 'conductivity': value = Math.round(200 + Math.random() * 800); break;
      case 'salinity': value = (0.1 + Math.random() * 2).toFixed(2); break;
      case 'depth': value = (3 + Math.random() * 8).toFixed(1); break;
      case 'speed': value = (0.5 + Math.random() * 1.5).toFixed(2); break;
      case 'direction': value = Math.round(Math.random() * 360); break;
      case 'wind_speed': value = (2 + Math.random() * 8).toFixed(1); break;
      case 'wind_dir': value = Math.round(Math.random() * 360); break;
      case 'air_temp': value = (18 + Math.random() * 12).toFixed(1); break;
      case 'humidity': value = Math.round(40 + Math.random() * 40); break;
      case 'pressure': value = Math.round(1005 + Math.random() * 25); break;
      default: value = '0.0';
    }
    readings[param] = {
      value: parseFloat(value),
      unit: info.unit,
      label: info.label,
      timestamp: new Date().toISOString(),
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
    };
  });
  return readings;
};

export const useStationData = (stationId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!stationId) return;
    try {
      setLoading(true);
      setError(null);
      await new Promise(r => setTimeout(r, 500));
      const station = STATIONS.find(s => s.id === stationId);
      if (!station) {
        setError('Station not found');
        setLoading(false);
        return;
      }
      const readings = generateReadings(station);
      setData({ ...station, readings });
    } catch (err) {
      setError(err.message || 'Failed to load station data');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
