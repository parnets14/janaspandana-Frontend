import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdHome, MdNotifications, MdEdit, MdLogout, MdKeyboardArrowDown, MdHelp, MdLanguage, MdInfo } from 'react-icons/md'
import { RiFileList3Line } from 'react-icons/ri'
import api from '../../utils/secureApi'

const navItems = [
  { key: 'dashboard', label: 'Home', icon: <MdHome size={20} />, path: '/user/dashboard' },
  { key: 'about', label: 'About IGMS', icon: <MdInfo size={20} />, path: '/user/about' },
  { key: 'complaints', label: 'My Complaints', icon: <RiFileList3Line size={20} />, path: '/user/complaints' },
  { key: 'notifications', label: 'Notifications', icon: <MdNotifications size={20} />, path: '/user/notifications' },
  { key: 'help', label: 'Help', icon: <MdHelp size={20} />, path: '/user/help' },
]

export default function UserLayout({ children, active, user: userProp }) {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  // Cache user in sessionStorage to avoid flicker on navigation
  const getCachedUser = () => {
    try {
      const cached = sessionStorage.getItem('_usr')
      return cached ? JSON.parse(cached) : null
    } catch { return null }
  }

  const [user, setUser] = useState(userProp || getCachedUser())

  useEffect(() => {
    if (userProp) {
      setUser(userProp)
      try { sessionStorage.setItem('_usr', JSON.stringify(userProp)) } catch {}
      return
    }
    // Only fetch if no cached data
    if (!getCachedUser()) {
      api.get('/auth/me').then(res => {
        if (res.success) {
          setUser(res.data)
          try { sessionStorage.setItem('_usr', JSON.stringify(res.data)) } catch {}
        }
      }).catch(() => {})
    }
  }, [userProp])

  const initials = user?.name?.charAt(0)?.toUpperCase() || '?'

  const handleLogout = () => {
    api.clearTokens()
    try { sessionStorage.removeItem('_usr') } catch {}
    navigate('/')
  }

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#FFF7EC',
      fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Top Navbar */}
      <nav style={{
        width: '100%', backgroundColor: '#fff',
        borderBottom: '1px solid #ede5d8',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          height: '68px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }} className="nav-pad">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src="/logo.jpeg" alt="logo" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#2596be', lineHeight: 1.2 }}>JanaSpandana</div>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#41A465' }}>ಜನರ ದನಿ, ಸರ್ಕಾರದ ಸ್ಪಂದನ</div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="nav-links">
            {navItems.map(item => (
              <button key={item.key} onClick={() => navigate(item.path)} style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '8px 16px', borderRadius: '10px', border: 'none',
                backgroundColor: active === item.key ? '#fef0e6' : 'transparent',
                color: active === item.key ? '#2596be' : '#6b5e52',
                fontSize: '14px', fontWeight: active === item.key ? '700' : '500',
                cursor: 'pointer',
              }}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 12px', borderRadius: '10px',
                border: '1px solid #e0d5c8', backgroundColor: '#fff',
                cursor: 'pointer',
              }}
            >
              {user?.photo ? (
                <img src={user.photo} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  backgroundColor: '#2596be', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '16px', color: '#fff', fontWeight: '700',
                }}>
                  {initials}
                </div>
              )}
              <MdKeyboardArrowDown size={18} color="#6b5e52" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div 
                  onClick={() => setShowDropdown(false)}
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
                />
                <div style={{
                  position: 'absolute', top: '50px', right: 0,
                  backgroundColor: '#fff', borderRadius: '12px',
                  border: '1px solid #e0d5c8', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  minWidth: '200px', zIndex: 1000,
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #ede5d8' }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>{user?.name || 'User'}</p>
                    <p style={{ fontSize: '12px', color: '#6b5e52', margin: '2px 0 0' }}>+91 {user?.phone || ''}</p>
                  </div>
                  <button 
                    onClick={() => { setShowDropdown(false); navigate('/user/profile'); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '12px 16px', border: 'none', backgroundColor: 'transparent',
                      cursor: 'pointer', fontSize: '14px', color: '#1a1a1a',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#faf6f0'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <MdEdit size={18} color="#2596be" /> Edit Profile
                  </button>
                  <button 
                    onClick={() => { setShowDropdown(false); handleLogout(); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '12px 16px', border: 'none', backgroundColor: 'transparent',
                      cursor: 'pointer', fontSize: '14px', color: '#1a1a1a',
                      textAlign: 'left', borderTop: '1px solid #ede5d8',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef0e6'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <MdLogout size={18} color="#2596be" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main style={{ flex: 1, width: '100%', maxWidth: '1280px', margin: '0 auto' }} className="page-pad">
        {children}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e0d5c8', padding: '16px 32px', backgroundColor: '#FFF7EC', textAlign: 'center' }}>
        <span style={{ fontSize: '12px', color: '#9e8e80' }}>Protected by National Informatics Centre. © 2024 IGMS.</span>
      </footer>
    </div>
  )
}
