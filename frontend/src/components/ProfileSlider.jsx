import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Settings, Heart, Bell, LogOut } from 'lucide-react';

const ProfileSlider = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 999,
            }}
          />

          {/* Slider */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              maxWidth: '400px',
              height: '100%',
              backgroundColor: 'var(--surface)',
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button onClick={onClose} style={{ cursor: 'pointer', padding: '0.5rem', background: 'var(--background)', borderRadius: '50%' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem', textAlign: 'center' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '2.5rem', fontWeight: 800 }}>
                JD
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>John Doe</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>john.doe@smartcart.io</p>
              <p style={{ color: 'var(--text-muted)' }}>+91 98765 43210</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              {[
                { icon: <Heart size={18} />, label: 'Saved Items', count: '12' },
                { icon: <Bell size={18} />, label: 'Price Drop Alerts', count: '3' },
                { icon: <Settings size={18} />, label: 'Account Settings' },
              ].map((item, i) => (
                <button key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                    {item.label}
                  </div>
                  {item.count && (
                    <span style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
              <button style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileSlider;
