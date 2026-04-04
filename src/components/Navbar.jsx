import { useNavigate } from 'react-router-dom'
import { MdArrowBack, MdSearch, MdInfo } from 'react-icons/md'

export default function Navbar({ variant = 'landing', onTrackClick }) {
  const navigate = useNavigate()

  return (
    <nav style={{ 
      width: '100%', 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #ede5d8',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="navbar-container" style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '0 32px',
        height: '68px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        
        {/* Logo */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            cursor: 'pointer',
            minWidth: 0,
            flex: '0 1 auto',
          }}
          onClick={() => navigate('/')}
        >
          <img 
            src="/logo.jpeg" 
            alt="logo" 
            style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div className="logo-title" style={{ 
              fontSize: '16px', 
              fontWeight: '800', 
              color: '#2596be', 
              lineHeight: '1.2',
              whiteSpace: 'nowrap',
            }}>
              JanaSpandana
            </div>
            <div className="logo-subtitle" style={{ 
              fontSize: '10px', 
              fontWeight: '600', 
              color: '#41A465',
              whiteSpace: 'nowrap',
            }}>
              ಜನರ ದನಿ, ಸರ್ಕಾರದ ಸ್ಪಂದನ
            </div>
          </div>
        </div>

        {/* Right side buttons */}
        {variant === 'landing' ? (
          <button 
            onClick={() => navigate('/about')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: '#fef0e6',
              border: '1px solid #2596be',
              color: '#2596be',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#2596be'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#fef0e6'
              e.currentTarget.style.color = '#2596be'
            }}
          >
            <MdInfo size={18} />
            <span>About IGMS</span>
          </button>
        ) : (
          <button 
            onClick={() => navigate('/')}
            style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: '#f0e8dc',
              border: '1px solid #e0d5c8',
              color: '#555',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background-color 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e8dfd0'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f0e8dc'}
          >
            <MdArrowBack size={16} /> 
            <span className="back-text">Back to Home</span>
          </button>
        )}
      </div>
    </nav>
  )
}
