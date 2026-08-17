import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const heroTextRef1 = useRef(null);
  const heroTextRef2 = useRef(null);
  const heroBgRef = useRef(null);
  const horizontalSectionRef = useRef(null);
  const horizontalContainerRef = useRef(null);
  const aiSectionRef = useRef(null);
  const trustScoreRef = useRef(null);

  useEffect(() => {
    // Hero Entrance
    const tl = gsap.timeline({ delay: 1.5 }); // wait for preloader
    tl.fromTo(heroTextRef1.current, { y: 100, opacity: 0, clipPath: 'inset(100% 0 0 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power4.out' })
      .fromTo(heroTextRef2.current, { y: 100, opacity: 0, clipPath: 'inset(100% 0 0 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power4.out' }, '-=0.8');

    // Hero Parallax
    gsap.to(heroBgRef.current, {
      scale: 1.08,
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    gsap.to([heroTextRef1.current, heroTextRef2.current], {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Horizontal Scroll Section
    const scrollWidth = horizontalContainerRef.current.scrollWidth;
    const windowWidth = window.innerWidth;
    gsap.to(horizontalContainerRef.current, {
      x: - (scrollWidth - windowWidth + 100),
      ease: 'none',
      scrollTrigger: {
        trigger: horizontalSectionRef.current,
        start: 'top top',
        end: () => `+=${scrollWidth}`,
        scrub: 1,
        pin: true,
      }
    });

    // AI Trust Reveal
    gsap.fromTo('.ai-text-reveal', 
      { opacity: 0, y: 50, filter: 'blur(8px)' },
      { 
        opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: aiSectionRef.current,
          start: 'top 80%',
        }
      }
    );

    // SmartCart Score Counter
    let scoreObj = { val: 0 };
    gsap.to(scoreObj, {
      val: 92,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: trustScoreRef.current,
        start: 'top 80%',
      },
      onUpdate: () => {
        if (trustScoreRef.current) {
          trustScoreRef.current.innerText = Math.round(scoreObj.val);
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const trendingProducts = [
    { id: 1, name: 'Sony WH-1000XM5', price: '₹29,990', img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80' },
    { id: 2, name: 'MacBook Air M3', price: '₹1,14,900', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80' },
    { id: 3, name: 'iPhone 15 Pro', price: '₹1,34,900', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80' },
    { id: 4, name: 'AirPods Pro 2', price: '₹24,900', img: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80' },
    { id: 5, name: 'PS5 Console', price: '₹54,990', img: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', overflow: 'hidden' }}>
      
      {/* Hero Section */}
      <section ref={heroRef} style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div ref={heroBgRef} style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '110%',
          backgroundImage: 'url(https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=2000&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.7)'
        }} />
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#fff' }}>
          <div className="line-mask">
            <h1 ref={heroTextRef1} className="title-xl">SHOP</h1>
          </div>
          <br />
          <div className="line-mask">
            <h1 ref={heroTextRef2} className="title-xl" style={{ color: 'var(--primary)' }}>SMARTER.</h1>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Section */}
      <section ref={horizontalSectionRef} style={{ height: '100vh', display: 'flex', alignItems: 'center', backgroundColor: 'var(--surface)', paddingLeft: '5vw' }}>
        <div style={{ position: 'absolute', top: '10vh', left: '5vw' }}>
          <h2 className="title-md" style={{ letterSpacing: '0.05em' }}>TRENDING NOW</h2>
        </div>
        <div ref={horizontalContainerRef} style={{ display: 'flex', gap: '4vw', marginTop: '10vh' }}>
          {trendingProducts.map((p, i) => (
            <div key={p.id} style={{ minWidth: '400px', height: '500px', position: 'relative' }} data-cursor="view" onClick={() => navigate(`/products/${p.id}`)}>
              <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{p.name}</h3>
                <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Trust Section */}
      <section ref={aiSectionRef} style={{ backgroundColor: '#0a0a0a', color: '#fff', padding: '15vh 5vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="title-lg ai-text-reveal" style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>REVIEWS CAN LIE.</h2>
          <h2 className="title-lg ai-text-reveal" style={{ color: 'var(--primary)', marginBottom: '5rem' }}>DATA DOESN'T HAVE TO.</h2>
          
          <div className="ai-text-reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem' }}>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: '1.5rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>SMARTCART AI</h4>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
                We analyze millions of reviews to filter out the noise and give you the real truth.
              </p>
            </div>
            
            <div style={{ position: 'relative', width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>TRUST SCORE</div>
                <div style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1 }}>
                  <span ref={trustScoreRef}>0</span><span style={{ fontSize: '2rem', color: 'var(--primary)' }}>/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ backgroundColor: 'var(--surface)', padding: '15vh 5vw', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 className="title-md" style={{ textAlign: 'center', marginBottom: '5rem', letterSpacing: '0.05em' }}>HOW IT WORKS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
            {[
              { step: "01", title: "Search", desc: "User searches for a product." },
              { step: "02", title: "Aggregate", desc: "SmartCart collects products from multiple websites." },
              { step: "03", title: "Analyze", desc: "Reviews are analyzed using AI." },
              { step: "04", title: "Filter", desc: "Fake reviews are filtered." },
              { step: "05", title: "Sentiment", desc: "Sentiment analysis is performed." },
              { step: "06", title: "Rank", desc: "Products are ranked using trust score." },
              { step: "07", title: "Recommend", desc: "Recommendation engine suggests best products." },
              { step: "08", title: "Compare", desc: "Final comparison dashboard is displayed." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                onClick={() => {
                  if (idx === 0 || idx === 1) navigate('/search');
                  else if (idx >= 2 && idx <= 6) navigate('/analytics');
                  else if (idx === 7) navigate('/compare');
                }}
                whileHover={{ y: -10, backgroundColor: 'rgba(0,0,0,0.02)' }}
                style={{ 
                  padding: '2rem', 
                  borderTop: '2px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderTopColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderTopColor = 'var(--border-color)'}
              >
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.5 }}>{item.step}</div>
                <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--primary)', color: '#fff' }}>
        <h2 className="title-xl" style={{ textAlign: 'center' }}>COMPARE <br/> BETTER.</h2>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/search')}
          style={{
            marginTop: '3rem',
            padding: '1.5rem 3rem',
            backgroundColor: '#111',
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          START SEARCHING →
        </motion.button>
      </section>
    </div>
  );
};

export default Home;
