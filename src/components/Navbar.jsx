import { useNavigate } from 'react-router-dom'
import { MdArrowBack, MdSearch, MdInfo } from 'react-icons/md'

export default function Navbar({ variant = 'landing', onTrackClick }) {
  const navigate = useNavigate()

  return (
    <nav style={{ 
      width: '100%', 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #E5E7EB',
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
              color: '#151A40', 
              lineHeight: '1.2',
              whiteSpace: 'nowrap',
            }}>
              JaNoNi
            </div>
            <div className="logo-subtitle" style={{ 
              fontSize: '10px', 
              fontWeight: '600', 
              color: '#41A465',
              whiteSpace: 'nowrap',
            }}>
              ಜನೋನಿ
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
              backgroundColor: '#EEF2FF',
              border: '1px solid #151A40',
              color: '#151A40',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#151A40'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#EEF2FF'
              e.currentTarget.style.color = '#151A40'
            }}
          >
            <MdInfo size={18} />
            <span>About</span>
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
              backgroundColor: '#F0F0F0',
              border: '1px solid #E5E7EB',
              color: '#555',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background-color 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e8dfd0'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F0F0F0'}
          >
            <MdArrowBack size={16} /> 
            <span className="back-text">Back to Home</span>
          </button>
        )}
      </div>
    </nav>
  )
}
