import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{
      backgroundColor: '#fff',
      color: '#001f3f',
      padding: '0',
      marginTop: '4rem',
      fontFamily: 'Satoshi, system-ui, sans-serif',
      width: '100%'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem',
        padding: '3rem 2rem 2rem 2rem',
        width: '100%'
      }}>
        
        {/* Company Info */}
        <div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#001f3f'
          }}>
            Loop.
          </h3>
          <p style={{
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: '#001f3f',
            marginBottom: '1rem'
          }}>
            Share more, hoard less. Join the circular economy in your community and discover amazing items from trusted hosts.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ color: '#CEF17B', fontSize: '1.5rem' }}>📘</a>
            <a href="#" style={{ color: '#CEF17B', fontSize: '1.5rem' }}>📷</a>
            <a href="#" style={{ color: '#CEF17B', fontSize: '1.5rem' }}>🐦</a>
            <a href="#" style={{ color: '#CEF17B', fontSize: '1.5rem' }}>💼</a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#001f3f'
          }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/" style={{
                color: '#001f3f',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'color 0.2s'
              }} onMouseOver={(e) => e.target.style.color = '#CEF17B'} onMouseOut={(e) => e.target.style.color = '#001f3f'}>
                Home
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/browse" style={{
                color: '#001f3f',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'color 0.2s'
              }} onMouseOver={(e) => e.target.style.color = '#CEF17B'} onMouseOut={(e) => e.target.style.color = '#001f3f'}>
                Browse Items
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/post-listing" style={{
                color: '#001f3f',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'color 0.2s'
              }} onMouseOver={(e) => e.target.style.color = '#CEF17B'} onMouseOut={(e) => e.target.style.color = '#001f3f'}>
                Post Item
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                color: '#001f3f',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'color 0.2s'
              }} onMouseOver={(e) => e.target.style.color = '#CEF17B'} onMouseOut={(e) => e.target.style.color = '#001f3f'}>
                How It Works
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#001f3f'
          }}>
            Support
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                color: '#001f3f',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'color 0.2s'
              }} onMouseOver={(e) => e.target.style.color = '#CEF17B'} onMouseOut={(e) => e.target.style.color = '#001f3f'}>
                Help Center
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                color: '#001f3f',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'color 0.2s'
              }} onMouseOver={(e) => e.target.style.color = '#CEF17B'} onMouseOut={(e) => e.target.style.color = '#001f3f'}>
                Contact Us
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                color: '#001f3f',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'color 0.2s'
              }} onMouseOver={(e) => e.target.style.color = '#CEF17B'} onMouseOut={(e) => e.target.style.color = '#001f3f'}>
                Safety Guidelines
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                color: '#001f3f',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'color 0.2s'
              }} onMouseOver={(e) => e.target.style.color = '#CEF17B'} onMouseOut={(e) => e.target.style.color = '#001f3f'}>
                Trust & Safety
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#001f3f'
          }}>
            Legal
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                color: '#001f3f',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'color 0.2s'
              }} onMouseOver={(e) => e.target.style.color = '#CEF17B'} onMouseOut={(e) => e.target.style.color = '#001f3f'}>
                Terms of Service
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                color: '#001f3f',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'color 0.2s'
              }} onMouseOver={(e) => e.target.style.color = '#CEF17B'} onMouseOut={(e) => e.target.style.color = '#001f3f'}>
                Privacy Policy
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                color: '#001f3f',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'color 0.2s'
              }} onMouseOver={(e) => e.target.style.color = '#CEF17B'} onMouseOut={(e) => e.target.style.color = '#001f3f'}>
                Cookie Policy
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{
                color: '#001f3f',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'color 0.2s'
              }} onMouseOver={(e) => e.target.style.color = '#CEF17B'} onMouseOut={(e) => e.target.style.color = '#001f3f'}>
                Accessibility
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#001f3f'
          }}>
            Stay Updated
          </h4>
          <p style={{
            fontSize: '0.95rem',
            color: '#001f3f',
            marginBottom: '1rem'
          }}>
            Get the latest updates on new features and community events.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '0.7rem',
                borderRadius: '8px',
                border: '1px solid #444',
                backgroundColor: '#2a2b5a',
                color: '#001f3f',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button style={{
              padding: '0.7rem 1rem',
              backgroundColor: '#CEF17B',
              color: '#1A1B41',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'background-color 0.2s'
            }} onMouseOver={(e) => e.target.style.backgroundColor = '#b8d96a'} onMouseOut={(e) => e.target.style.backgroundColor = '#CEF17B'}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid #444',
        paddingTop: '2rem',
        textAlign: 'center',
        color: '#001f3f',
        fontSize: '0.9rem'
      }}>
        <p>© 2024 Loop. All rights reserved. Made with ❤️ for sustainable communities.</p>
      </div>
    </footer>
  );
}

export default Footer;

