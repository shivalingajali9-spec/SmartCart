import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, X, Mic, MicOff } from 'lucide-react';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  
  const recognitionRef = useRef(null);

  // Prevent scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Initialize speech recognition if supported
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          setQuery(transcript);
          
          if (event.results[0].isFinal) {
            setIsListening(false);
            // Auto submit
            setTimeout(() => {
              onClose();
              navigate(`/search?q=${encodeURIComponent(transcript)}`);
            }, 500);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    } else {
      document.body.style.overflow = '';
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, navigate, onClose, isListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        setQuery('');
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Voice search is not supported in this browser.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const trendingSearches = ['iPhone 15', 'Sony WH-1000XM5', 'MacBook Air M3', 'Gaming Laptops', 'Smartwatch'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            padding: '10vh 5vw',
          }}
        >
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <X size={32} strokeWidth={1} color="var(--text-main)" />
          </button>

          <motion.form 
            onSubmit={handleSubmit}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
            style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}
          >
            <div style={{ position: 'relative', borderBottom: '2px solid var(--text-main)', display: 'flex', alignItems: 'center' }}>
              <input 
                autoFocus
                type="text"
                placeholder={isListening ? "Listening..." : "What are you looking for?"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  fontWeight: 800,
                  border: 'none',
                  background: 'transparent',
                  padding: '1rem 0',
                  outline: 'none',
                  color: isListening ? '#ef4444' : 'var(--text-main)',
                  letterSpacing: '-0.02em',
                  transition: 'color 0.3s ease'
                }}
              />
              <motion.button
                type="button"
                onClick={toggleListening}
                animate={{ scale: isListening ? [1, 1.2, 1] : 1 }}
                transition={{ repeat: isListening ? Infinity : 0, duration: 1.5 }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '1rem',
                  color: isListening ? '#ef4444' : 'var(--text-muted)'
                }}
              >
                {isListening ? <Mic size={36} /> : <MicOff size={36} />}
              </motion.button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ width: '100%', maxWidth: '800px', margin: '4rem auto 0' }}
          >
            <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>TRENDING SEARCHES</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {trendingSearches.map((term, i) => (
                <motion.button
                  key={term}
                  type="button"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.4 }}
                  onClick={() => {
                    setQuery(term);
                    navigate(`/search?q=${encodeURIComponent(term)}`);
                    onClose();
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '2rem',
                    border: '1px solid var(--border-color)',
                    background: 'var(--surface)',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {term}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
