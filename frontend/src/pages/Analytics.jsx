import { useState, useEffect } from 'react';
import { getAnalytics } from '../services/productApi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#22c55e', '#ef4444']; // Genuine (Green), Fake (Red)
const PLATFORM_COLORS = {
  'Amazon': '#ff9900',
  'Flipkart': '#2874f0',
  'Reliance Digital': '#e31837'
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getAnalytics();
        setData(stats);
      } catch (err) {
        setError(err.message || 'Failed to fetch analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', fontSize: '1.2rem' }}>Loading system analytics...</div>;
  if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>;
  if (!data) return null;

  const pieData = [
    { name: 'Genuine', value: data.overall_predictions.genuine },
    { name: 'Fake', value: data.overall_predictions.fake }
  ];

  const barData = data.platform_stats.map(stat => ({
    name: stat._id,
    Genuine: stat.genuine_count,
    Fake: stat.fake_count,
    Total: stat.total_reviews
  }));

  const sentimentData = data.overall_sentiment ? [
    { name: 'Positive', value: data.overall_sentiment.positive },
    { name: 'Neutral', value: data.overall_sentiment.neutral },
    { name: 'Negative', value: data.overall_sentiment.negative }
  ] : [];

  const SENTIMENT_COLORS = ['#3b82f6', '#94a3b8', '#f59e0b']; // Blue, Gray, Amber

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Platform Analytics</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>
        System-wide metrics and ML classification statistics.
      </p>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Products Monitored</div>
          <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)' }}>{data.total_products}</div>
        </div>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Reviews Analyzed</div>
          <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-main)' }}>{data.total_reviews.toLocaleString()}</div>
        </div>
        <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#fee2e2', border: '1px solid #fca5a5' }}>
          <div style={{ fontSize: '1rem', color: '#b91c1c', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Fake Reviews Detected</div>
          <div style={{ fontSize: '3rem', fontWeight: '800', color: '#7f1d1d' }}>{data.overall_predictions.fake.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Pie Chart */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Overall Platform Trust</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Review Authenticity by Platform</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar dataKey="Genuine" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Fake" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* New Row for Sentiment */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Overall Customer Sentiment</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Fraud Seller Leaderboard */}
      {data.fraudulent_sellers && data.fraudulent_sellers.length > 0 && (
        <div className="card" style={{ padding: '2rem', marginTop: '2rem', backgroundColor: '#fffbfb', border: '1px solid #fecaca' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span> Fraud Seller Leaderboard
          </h3>
          <p style={{ color: '#7f1d1d', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            These third-party sellers have been flagged by our AI for having an unusually high percentage of fake reviews across their product listings.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #fecaca', color: '#991b1b' }}>
                  <th style={{ padding: '1rem' }}>Seller Name</th>
                  <th style={{ padding: '1rem' }}>Platform</th>
                  <th style={{ padding: '1rem' }}>Total Reviews</th>
                  <th style={{ padding: '1rem' }}>Fake Reviews</th>
                  <th style={{ padding: '1rem' }}>% Fake</th>
                </tr>
              </thead>
              <tbody>
                {data.fraudulent_sellers.map((seller, index) => (
                  <tr key={`${seller.seller}-${seller.platform}`} style={{ borderBottom: '1px solid #fee2e2', backgroundColor: seller.fake_percentage > 50 ? '#fef2f2' : 'transparent' }}>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#7f1d1d' }}>{seller.seller}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.8rem', 
                        fontWeight: '600',
                        backgroundColor: PLATFORM_COLORS[seller.platform] ? `${PLATFORM_COLORS[seller.platform]}20` : '#eee',
                        color: PLATFORM_COLORS[seller.platform] || '#666'
                      }}>
                        {seller.platform}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{seller.total_reviews}</td>
                    <td style={{ padding: '1rem', color: '#b91c1c', fontWeight: 'bold' }}>{seller.fake_count}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '100px', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${seller.fake_percentage}%`, height: '100%', backgroundColor: seller.fake_percentage > 50 ? '#ef4444' : '#f59e0b' }} />
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: seller.fake_percentage > 50 ? '#ef4444' : '#f59e0b' }}>
                          {seller.fake_percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default Analytics;
