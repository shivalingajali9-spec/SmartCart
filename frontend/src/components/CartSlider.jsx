import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';

const CartSlider = ({ isOpen, onClose }) => {
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag /> Your Cart
              </h2>
              <button onClick={onClose} style={{ cursor: 'pointer', padding: '0.5rem', background: 'var(--background)', borderRadius: '50%' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <ShoppingBag size={32} color="var(--text-muted)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Your cart is empty</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Looks like you haven't added any items to your multi-platform cart yet.
              </p>
              <button className="btn-primary" onClick={onClose} style={{ width: '100%' }}>
                Continue Shopping
              </button>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Unified checkout is currently in beta testing.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSlider;
