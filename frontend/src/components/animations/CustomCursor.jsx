import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if it's a touch device or user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || prefersReducedMotion) {
      setIsTouchDevice(true);
      return;
    }

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.closest('[data-cursor="view"]')) {
        setCursorText("VIEW");
      } else if (target.closest('[data-cursor="compare"]')) {
        setCursorText("COMPARE");
      } else if (target.closest('[data-cursor="explore"]')) {
        setCursorText("EXPLORE");
      } else {
        setCursorText("");
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouchDevice) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: smoothX,
        y: smoothY,
        pointerEvents: 'none',
        zIndex: 10000,
        display: isVisible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={{
          width: cursorText ? 80 : 16,
          height: cursorText ? 80 : 16,
          backgroundColor: cursorText ? 'var(--text-main)' : 'rgba(0,0,0,0.5)',
          opacity: 1
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: cursorText ? 1 : 0 }}
          style={{
            color: 'var(--bg-color)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '1px'
          }}
        >
          {cursorText}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;
