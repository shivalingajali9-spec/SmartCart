import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  
  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      if (onComplete) onComplete();
      return;
    }

    const progressValues = [0, 8, 17, 26, 41, 58, 73, 89, 100];
    let step = 0;
    
    const intervalTime = 700 / progressValues.length; // ~700ms total progress duration
    
    const interval = setInterval(() => {
      step++;
      if (step < progressValues.length) {
        setProgress(progressValues[step]);
      } else {
        clearInterval(interval);
        
        const tl = gsap.timeline({
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
        
        tl.to(logoRef.current, {
          scale: 1.1,
          duration: 0.4,
          ease: 'power3.inOut'
        }, 0)
        .to(textRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: 'power2.in'
        }, 0)
        .to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut'
        }, 0.2);
      }
    }, intervalTime);
    
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: 'var(--text-main)',
        color: 'var(--bg-color)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div 
        ref={logoRef}
        style={{
          fontSize: '2rem',
          fontWeight: 900,
          letterSpacing: '0.1em',
          marginBottom: '2rem'
        }}
      >
        SMARTCART
      </div>
      <div 
        ref={textRef}
        style={{
          fontSize: '1.2rem',
          fontWeight: 400,
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        {progress.toString().padStart(2, '0')}%
      </div>
    </div>
  );
};

export default Preloader;
