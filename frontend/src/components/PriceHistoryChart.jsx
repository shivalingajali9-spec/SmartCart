import { useState, useEffect, useMemo } from 'react';
import { getProductPriceHistory } from '../services/productApi';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = {
  'Amazon': '#ff9900',
  'Flipkart': '#2874f0',
  'Reliance Digital': '#e31837'
};

const PriceHistoryChart = ({ productId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await getProductPriceHistory(productId);
        setData(response.history || []);
      } catch (err) {
        setError(err.message || 'Unable to fetch price history.');
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchHistory();
  }, [productId]);

  // Transform data for Recharts: Group by Date
  const chartData = useMemo(() => {
    if (!data.length) return [];
    
    // Group by date
    const dateMap = {};
    data.forEach(item => {
      const dateStr = new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      if (!dateMap[dateStr]) dateMap[dateStr] = { name: dateStr };
      dateMap[dateStr][item.platform] = item.price;
    });

    // Sort by actual date
    const sortedDates = Object.keys(dateMap).sort((a, b) => new Date(a) - new Date(b));
    return sortedDates.map(date => dateMap[date]);
  }, [data]);

  const platforms = useMemo(() => {
    const p = new Set();
    data.forEach(item => p.add(item.platform));
    return Array.from(p);
  }, [data]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading price history...</div>;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>;
  if (chartData.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>No price history available.</div>;

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        📈 Price History
      </h3>
      <div style={{ height: '350px', width: '100%' }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickMargin={10} />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickFormatter={(val) => `₹${val.toLocaleString('en-IN')}`}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              formatter={(value, name) => [`₹${value.toLocaleString('en-IN')}`, name]}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '1rem' }} />
            {platforms.map(platform => (
              <Line 
                key={platform}
                type="monotone" 
                dataKey={platform} 
                stroke={COLORS[platform] || '#333'} 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceHistoryChart;
