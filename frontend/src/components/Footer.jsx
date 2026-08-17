import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#050505',
      color: '#fff',
      padding: '5rem 5vw',
      marginTop: 'auto',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
        
        {/* Conclusion Section */}
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '1.5rem', color: 'var(--primary)' }}>
            SMARTCART
          </h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            SmartCart is an advanced AI-powered e-commerce aggregator platform that combines product comparison, fake review detection, recommendation systems, sentiment analysis, and real-time price tracking into a single intelligent solution.
          </p>
          <br />
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            The system helps users make secure, smart, and trustworthy purchasing decisions while improving the online shopping experience.
          </p>
        </div>

        {/* References Section */}
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '1.5rem', color: '#fff' }}>
            REFERENCES & SOURCES
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { name: 'Amazon', link: 'https://www.amazon.in/' },
              { name: 'Flipkart', link: 'https://www.flipkart.com/' },
              { name: 'Myntra', link: 'https://www.myntra.com/' },
              { name: 'Scikit-learn Documentation', link: 'https://scikit-learn.org/stable/' },
              { name: 'TensorFlow Documentation', link: 'https://www.tensorflow.org/api_docs' },
              { name: 'MySQL Documentation', link: 'https://dev.mysql.com/doc/' },
              { name: 'Oracle Java Documentation', link: 'https://docs.oracle.com/en/java/' }
            ].map((ref, i) => (
              <li key={i}>
                <a 
                  href={ref.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                >
                  ↗ {ref.name}
                </a>
              </li>
            ))}
          </ul>
        </div>


        {/* Contact Section */}
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '1.5rem', color: '#fff' }}>
            CONTACT US
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--primary)' }}>✉</span>
              <a href="mailto:support@smartcart.io" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
                support@smartcart.io
              </a>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--primary)' }}>☏</span>
              <a href="tel:+919876543210" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
                +91 98765 43210
              </a>
            </li>
          </ul>
        </div>

      </div>
      
      <div style={{ textAlign: 'center', marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} SmartCart Intelligence Platform. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
