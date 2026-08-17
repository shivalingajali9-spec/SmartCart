import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { askChatbot } from '../../services/productApi';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your SmartCart AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await askChatbot(userMessage);
      
      setMessages(prev => [...prev, { sender: 'bot', text: response.reply }]);
      
      if (response.action && response.action.type === 'SEARCH') {
        setTimeout(() => {
          navigate(`/search?q=${encodeURIComponent(response.action.payload)}`);
          setIsOpen(false);
        }, 1500);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting to my servers right now.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'var(--background)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              zIndex: 9999
            }}
          >
            <MessageSquare size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: '350px',
              height: '500px',
              backgroundColor: 'var(--surface)',
              borderRadius: '1rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 9999,
              overflow: 'hidden',
              border: '1px solid var(--border-color)'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--primary)',
              color: 'var(--background)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <Bot size={20} /> SmartCart AI
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--background)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '0.5rem'
                }}>
                  {msg.sender === 'bot' && <div style={{ minWidth: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={16} /></div>}
                  <div style={{
                    backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--background)',
                    color: msg.sender === 'user' ? 'var(--background)' : 'var(--text-main)',
                    padding: '0.75rem 1rem',
                    borderRadius: '1rem',
                    borderBottomRightRadius: msg.sender === 'user' ? '0.2rem' : '1rem',
                    borderBottomLeftRadius: msg.sender === 'bot' ? '0.2rem' : '1rem',
                    maxWidth: '80%',
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none'
                  }}>
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && <div style={{ minWidth: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} /></div>}
                </div>
              ))}
              {isTyping && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ minWidth: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={16} /></div>
                  <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--background)', borderRadius: '1rem', borderBottomLeftRadius: '0.2rem', border: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '2rem',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
              <button type="submit" disabled={!input.trim()} style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: input.trim() ? 'var(--primary)' : 'var(--border-color)',
                color: 'var(--background)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'default',
                transition: 'background-color 0.2s'
              }}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
