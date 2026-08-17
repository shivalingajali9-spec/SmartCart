import { useCompare } from '../context/CompareContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import MagneticButton from './animations/MagneticButton';

const ProductCard = ({ product }) => {
  const { compareItems, addToCompare, removeFromCompare } = useCompare();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const isSelected = compareItems.some(item => item.product_id === product.product_id);
  
  const bestListing = product.listings.reduce((prev, curr) => 
    prev.price < curr.price ? prev : curr
  );

  const handleViewDetails = () => {
    navigate(`/products/${product.product_id}`, { state: { product } });
  };

  return (
    <motion.div 
      className="card"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{ 
        y: isHovered ? -10 : 0, 
        boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)' 
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden'
      }}
      onClick={handleViewDetails}
      data-cursor="view"
    >
      <motion.div 
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 20 }}
        onClick={(e) => { e.stopPropagation(); }}
      >
        <Heart size={24} color="var(--text-main)" strokeWidth={1.5} />
      </motion.div>

      {product.smartcart_choice && (
        <div style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          backgroundColor: 'var(--primary)',
          color: 'white',
          padding: '0.35rem 0.75rem',
          fontWeight: 800,
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          zIndex: 10,
        }}>
          SmartCart Choice
        </div>
      )}
      
      <div style={{ 
        padding: '2.5rem', 
        height: '280px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9f9f9'
      }}>
        <motion.img 
          animate={{ scale: isHovered ? 1.06 : 1, y: isHovered ? -5 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          src={product.image_url || 'https://via.placeholder.com/200x200?text=No+Image'} 
          alt={`${product.brand} ${product.name}`} 
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
        />
      </div>
      
      <motion.div 
        animate={{ y: isHovered ? -15 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--surface)' }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>{product.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.brand} • {product.category}
          </p>
        </div>

        <motion.div 
          animate={{ x: isHovered ? 5 : 0 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}
        >
          {product.listings.map(l => (
            <span key={l.id} style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', border: '1px solid var(--border-color)', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              {l.platform.toUpperCase()}
            </span>
          ))}
        </motion.div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', marginTop: 'auto' }}>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              ₹{bestListing.price.toLocaleString('en-IN')}
            </span>
            {bestListing.discount > 0 && (
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                ₹{bestListing.original_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {bestListing.discount > 0 && (
            <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem' }}>-{bestListing.discount}%</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-main)', fontWeight: 800 }}>
            ★ {product.adjusted_rating ? product.adjusted_rating.toFixed(1) : bestListing.rating.toFixed(1)}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            ({bestListing.review_count.toLocaleString()})
          </div>
          {product.aggregate_trust_score && (
            <div style={{ marginLeft: 'auto', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.05em', color: product.aggregate_trust_score > 70 ? 'var(--success)' : 'var(--warning)' }}>
              AI {product.aggregate_trust_score}
            </div>
          )}
        </div>
      </motion.div>

      {/* Hidden Hover Actions */}
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: isHovered ? '0%' : '100%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ 
          position: 'absolute', 
          bottom: 0, left: 0, right: 0, 
          padding: '1rem', 
          backgroundColor: 'var(--surface)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
        }}
      >
        <MagneticButton 
          className={isSelected ? "btn-outline" : "btn-primary"} 
          style={{ width: '100%', padding: '1rem', fontSize: '0.8rem' }}
          onClick={(e) => {
            e.stopPropagation();
            if (isSelected) removeFromCompare(product.product_id);
            else addToCompare(product);
          }}
        >
          {isSelected ? 'REMOVE FROM COMPARE' : 'ADD TO COMPARE'}
        </MagneticButton>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
