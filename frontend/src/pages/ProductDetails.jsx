import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getProductReviews, searchProducts } from '../services/productApi';
import PriceHistoryChart from '../components/PriceHistoryChart';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

// Animated Counter component for prices and scores
const AnimatedCounter = ({ value, prefix = '', suffix = '' }) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    
    let obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 1.5,
      ease: 'power3.out',
      onUpdate: () => {
        node.textContent = `${prefix}${Math.floor(obj.val).toLocaleString('en-IN')}${suffix}`;
      }
    });
  }, [value, prefix, suffix]);

  return <span ref={nodeRef}>{prefix}0{suffix}</span>;
};

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(location.state?.product || null);
  const [reviews, setReviews] = useState([]);
  const [trustScore, setTrustScore] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        try {
          const data = await searchProducts('');
          const found = data.products?.find(p => p.product_id === id);
          if (found) setProduct(found);
          else setError('Product not found in database.');
        } catch (err) {
          setError('Failed to load product details.');
        }
      };
      fetchProduct();
    }
  }, [id, product]);
  
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await getProductReviews(id);
        setReviews(data.reviews || []);
        setTrustScore({
          aggregate_trust_score: data.aggregate_trust_score,
          genuine_percentage: data.genuine_percentage
        });
        setRatings({
          original: data.original_rating,
          adjusted: data.adjusted_rating
        });
        
        // Simulate "AI Analysis" taking slightly longer for dramatic effect
        setTimeout(() => setAnalyzing(false), 2000);
      } catch (err) {
        setError(err.message || 'Unable to fetch reviews.');
        setAnalyzing(false);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  if (error && !product) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <h2 className="title-md">{error}</h2>
        <button onClick={() => navigate('/search')} className="btn-primary" style={{ marginTop: '2rem' }}>Back to Search</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <h2 className="title-md">Loading product details...</h2>
      </div>
    );
  }

  // Find the lowest price to highlight
  const minPrice = Math.min(...product.listings.map(l => l.price));

  return (
    <div style={{ padding: '5vh 5vw', maxWidth: '1400px', margin: '0 auto', color: 'var(--text-main)' }}>
      <button onClick={() => navigate(-1)} className="btn-outline" style={{ marginBottom: '3rem', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
        ← BACK
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
        
        {/* Cinematic Product Image Reveal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ position: 'relative', height: '600px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
          <motion.img 
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            src={product.image_url} 
            alt={product.name} 
            style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain', mixBlendMode: 'multiply', cursor: 'crosshair' }} 
            data-cursor="explore"
          />
        </motion.div>

        {/* Details & Pricing */}
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1rem' }}
          >
            {product.name}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ color: 'var(--text-muted)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }}
          >
            {product.brand} • {product.category}
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ marginBottom: '3rem', fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)' }}
          >
            {product.description}
          </motion.p>
          
          {/* Price Comparison Block */}
          <div style={{ marginBottom: '4rem' }}>
            <h3 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              ONE PRODUCT. EVERY STORE.
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {product.listings.map((l, index) => {
                const isBest = l.price === minPrice;
                return (
                  <motion.div 
                    key={l.id} 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.6, ease: 'easeOut' }}
                    style={{ 
                      padding: '1.5rem', 
                      border: isBest ? '2px solid var(--text-main)' : '1px solid var(--border-color)', 
                      borderRadius: 'var(--radius-sm)', 
                      backgroundColor: isBest ? 'var(--text-main)' : 'var(--surface)',
                      color: isBest ? 'var(--bg-color)' : 'var(--text-main)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {isBest && (
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                      />
                    )}
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '1rem' }}>{l.platform.toUpperCase()}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                      <AnimatedCounter value={l.price} prefix="₹" />
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: isBest ? 'var(--success)' : 'var(--text-muted)' }}>
                      {l.availability} {isBest && '• BEST PRICE'}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic AI Rating Transformation */}
      <div style={{ marginTop: '6rem', marginBottom: '4rem', backgroundColor: '#0a0a0a', color: '#fff', padding: '4rem', borderRadius: 'var(--radius-lg)' }}>
        <h2 className="title-md" style={{ textAlign: 'center', marginBottom: '3rem' }}>AI RATING TRANSFORMATION</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '1rem' }}>★ {ratings?.original || 4.5}</div>
                <div style={{ fontSize: '1rem', letterSpacing: '0.2em', color: 'var(--primary)', textTransform: 'uppercase' }}>Analyzing {reviews.length} reviews...</div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1, ease: 'power4.out' }}
                style={{ display: 'flex', width: '100%', justifyContent: 'space-around', alignItems: 'center' }}
              >
                <div style={{ textAlign: 'center', opacity: 0.5 }}>
                  <div style={{ fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>ORIGINAL RATING</div>
                  <div style={{ fontSize: '3rem', fontWeight: 900, textDecoration: 'line-through' }}>★ {ratings?.original || 4.5}</div>
                </div>
                
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100px' }}
                  style={{ height: '2px', backgroundColor: 'var(--primary)' }}
                />
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: '1rem', color: 'var(--primary)' }}>ADJUSTED RATING</div>
                  <div style={{ fontSize: '5rem', fontWeight: 900 }}>★ {ratings?.adjusted || 4.1}</div>
                  <div style={{ fontSize: '0.9rem', marginTop: '1rem', color: 'var(--warning)' }}>
                    <AnimatedCounter value={reviews.length - Math.round(reviews.length * ((trustScore?.genuine_percentage || 100)/100))} /> suspicious reviews detected
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Price History Chart */}
      <PriceHistoryChart productId={id} />

      {/* Reviews Section */}
      <div style={{ marginTop: '6rem' }}>
        <h2 className="title-md" style={{ marginBottom: '2rem' }}>VERIFIED REVIEWS</h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {reviews.map((review, i) => (
              <motion.div 
                key={review.review_id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card" 
                style={{ padding: '2rem', backgroundColor: 'var(--surface)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{review.reviewer_name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{review.platform} • {review.review_date}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--text-main)', fontWeight: 900, fontSize: '1.2rem' }}>★ {review.rating}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, marginTop: '0.5rem', padding: '0.2rem 0.5rem', backgroundColor: review.prediction === 'genuine' ? '#dcfce7' : '#fee2e2', color: review.prediction === 'genuine' ? '#166534' : '#991b1b' }}>
                      {review.prediction.toUpperCase()}
                    </div>
                  </div>
                </div>
                <p style={{ lineHeight: 1.6, color: 'var(--text-muted)' }}>"{review.review_text}"</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
