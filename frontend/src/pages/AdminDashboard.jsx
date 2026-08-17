import { useState, useEffect } from 'react';
import { getSystemHealth, retrainModel } from '../services/productApi';
import { motion } from 'framer-motion';
import { Database, Brain, Activity, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const [health, setHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  
  const [retraining, setRetraining] = useState(false);
  const [retrainResult, setRetrainResult] = useState(null);
  const [retrainError, setRetrainError] = useState(null);

  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const data = await getSystemHealth();
      setHealth(data);
    } catch (err) {
      setHealth({ status: 'error', services: {} });
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleRetrain = async () => {
    if (!window.confirm("Are you sure you want to retrain the ML model? This will temporarily pause inference.")) return;
    
    setRetraining(true);
    setRetrainResult(null);
    setRetrainError(null);
    try {
      const result = await retrainModel();
      setRetrainResult(result);
      await fetchHealth(); // Refresh health to show updated model
    } catch (err) {
      setRetrainError(err.error || err.message || "Failed to retrain model");
    } finally {
      setRetraining(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'connected') return <CheckCircle size={20} color="#22c55e" />;
    if (status === 'warning') return <AlertTriangle size={20} color="#eab308" />;
    return <XCircle size={20} color="#ef4444" />;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Activity size={32} /> System Admin
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>
        Manage microservices and Artificial Intelligence models.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* System Health */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} /> Microservices Health
          </h3>
          
          {loadingHealth ? (
            <div style={{ color: 'var(--text-muted)' }}>Pinging services...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600 }}>MySQL (Relational)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {health?.services?.mysql?.message} {getStatusIcon(health?.services?.mysql?.status)}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600 }}>MongoDB (Document)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {health?.services?.mongodb?.message} {getStatusIcon(health?.services?.mongodb?.status)}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600 }}>ML Inference API</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {health?.services?.ml_service?.message} {getStatusIcon(health?.services?.ml_service?.status)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ML Control Center */}
        <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--surface-dark)', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
            <Brain size={20} /> AI Model Management
          </h3>
          
          <p style={{ color: '#aaa', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            The Fake Review Detection system uses a Scikit-Learn Logistic Regression model with TF-IDF vectorization. 
            You can manually trigger a retraining pipeline here, which will rebuild the models using the latest dataset and hot-swap them into memory.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRetrain}
            disabled={retraining}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: retraining ? '#555' : 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: retraining ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw size={18} className={retraining ? 'spin' : ''} />
            {retraining ? 'Retraining Pipeline Running...' : 'Force Model Retraining'}
          </motion.button>

          {retrainError && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 'var(--radius-sm)' }}>
              {retrainError}
            </div>
          )}

          {retrainResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#111', border: '1px solid #333', borderRadius: 'var(--radius-sm)' }}
            >
              <h4 style={{ color: '#22c55e', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} /> {retrainResult.message}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: '#ddd' }}>
                <div><strong>Accuracy:</strong> {(retrainResult.stats.accuracy * 100).toFixed(2)}%</div>
                <div><strong>Samples:</strong> {retrainResult.stats.total_samples}</div>
                <div><strong>Vocab Size:</strong> {retrainResult.stats.vocab_size}</div>
                <div><strong>Time:</strong> {retrainResult.stats.training_time_seconds.toFixed(2)}s</div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
      
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
