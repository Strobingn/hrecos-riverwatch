import { useState, useEffect, useCallback } from 'react';

const ANOMALY_TYPES = [
  { type: 'high_temp', severity: 'warning', message: 'Water temperature above seasonal average', station: 'Turkey Point' },
  { type: 'low_do', severity: 'critical', message: 'Dissolved oxygen levels critically low', station: 'Norrie Point' },
  { type: 'high_turbidity', severity: 'warning', message: 'Elevated turbidity detected', station: 'Albany' },
  { type: 'ph_drift', severity: 'info', message: 'pH showing gradual decline', station: 'Schodack Island' },
  { type: 'sensor_offline', severity: 'critical', message: 'Conductivity sensor offline', station: 'Coxsackie' },
];

const generateAnomalies = () => {
  const count = Math.floor(Math.random() * 4); // 0-3 anomalies
  const selected = [];
  const used = new Set();
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * ANOMALY_TYPES.length);
    if (!used.has(idx)) {
      used.add(idx);
      selected.push({
        ...ANOMALY_TYPES[idx],
        id: `anomaly-${Date.now()}-${i}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      });
    }
  }
  // Sort: critical first, then warning, then info
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  selected.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  return selected;
};

export const useAnomalies = (limit = null) => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(r => setTimeout(r, 400));
      const data = generateAnomalies();
      setAnomalies(limit ? data.slice(0, limit) : data);
    } catch (err) {
      setError(err.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { anomalies, loading, error, refetch: fetchData };
};
