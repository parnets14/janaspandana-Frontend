import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineEngineering, MdNotifications, MdDashboard, MdLogout, MdMenu, MdClose } from 'react-icons/md'
import { RiFileList3Line } from 'react-icons/ri'

const navItems = [
  { key: 'dashboard', label: 'Tasks', icon: <MdDashboard size={20} />, path: '/officer/dashboard' },
]

export default function OfficerLayout({ children, active }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#ffffff',
      fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Navbar */}
      <nav style={{ width: '100%', backgroundColor: '#fff', borderBottom: '1px solid #ede5d8', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }} className="nav-pad">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src="/logo.jpeg" alt="JaNoNi" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#151A40', lineHeight: 1.2 }}>JaNoNi</div>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#41A465' }}>Officer Portal</div>
            </div>
          </div>

          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {navItems.map(item => (
              <button key={item.key} onClick={() => navigate(item.path)} style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '8px 16px', borderRadius: '10px', border: 'none',
                backgroundColor: active === item.key ? '#fff' : 'transparent',
                color: '#1a1a1a',
                border: active === item.key ? '1px solid #1a1a1a' : '1px solid transparent',
                fontSize: '14px', fontWeight: active === item.key ? '700' : '500', cursor: 'pointer',
              }}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{ 
              display: 'none',
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              border: '1px solid #e0d5c8', 
              backgroundColor: '#fff', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            {menuOpen ? <MdClose size={24} color="#151A40" /> : <MdMenu size={24} color="#151A40" />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="desktop-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '10px', backgroundColor: '#fff', border: '1px solid #1a1a1a' }}>
              <MdOutlineEngineering size={18} color="#151A40" />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#151A40' }}> Officer</span>
            </div>
            <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '1px solid #e0d5c8', backgroundColor: '#fff', color: '#555', fontSize: '13px', cursor: 'pointer' }}>
              <MdLogout size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div 
            className="mobile-menu"
            style={{
              position: 'absolute',
              top: '68px',
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              borderBottom: '1px solid #ede5d8',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 99,
            }}
          >
            <div style={{ padding: '16px' }}>
              {navItems.map(item => (
                <button 
                  key={item.key} 
                  onClick={() => { navigate(item.path); setMenuOpen(false); }} 
                  style={{
                    width: '100%',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '14px 16px', 
                    borderRadius: '10px', 
                    border: 'none',
                    backgroundColor: active === item.key ? '#fef0e6' : 'transparent',
                    color: active === item.key ? '#151A40' : '#6b5e52',
                    fontSize: '15px', 
                    fontWeight: active === item.key ? '700' : '500', 
                    cursor: 'pointer',
                    marginBottom: '8px',
                    textAlign: 'left',
                  }}
                >
                  {item.icon} {item.label}
                </button>
              ))}
              
              <div style={{ borderTop: '1px solid #ede5d8', marginTop: '12px', paddingTop: '12px' }}>
                <button 
                  onClick={() => { navigate('/'); setMenuOpen(false); }}
                  style={{
                    width: '100%',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '14px 16px', 
                    borderRadius: '10px', 
                    border: '1px solid #e0d5c8',
                    backgroundColor: '#fff',
                    color: '#555',
                    fontSize: '15px', 
                    fontWeight: '600', 
                    cursor: 'pointer',
                  }}
                >
                  <MdLogout size={20} /> Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main style={{ flex: 1, width: '100%', maxWidth: '1280px', margin: '0 auto' }} className="page-pad">
        {children}
      </main>

      <footer style={{ borderTop: '1px solid #e5e7eb', padding: '16px 32px', backgroundColor: '#ffffff', textAlign: 'center' }}>
        <span style={{ fontSize: '12px', color: '#9e8e80' }}>© {new Date().getFullYear()} JaNoNi. All rights reserved.</span>
      </footer>
    </div>
  )
}
