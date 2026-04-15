import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdHome, MdEdit, MdLogout, MdKeyboardArrowDown, MdHelp, MdInfo, MdMenu, MdClose } from 'react-icons/md'
import { RiFileList3Line } from 'react-icons/ri'
import api from '../../utils/secureApi'

const navItems = [
  { key: 'dashboard', label: 'Home', icon: <MdHome size={20} />, path: '/user/dashboard' },
  { key: 'about', label: 'About ', icon: <MdInfo size={20} />, path: '/user/about' },
  { key: 'complaints', label: 'My Complaints', icon: <RiFileList3Line size={20} />, path: '/user/complaints' },
  // { key: 'notifications', label: 'Notifications', icon: <MdNotifications size={20} />, path: '/user/notifications' },
  { key: 'help', label: 'Help', icon: <MdHelp size={20} />, path: '/user/help' },
]

export default function UserLayout({ children, active, user: userProp }) {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Cache user in sessionStorage to avoid flicker on navigation
  const getCachedUser = () => {
    try {
      // Try sessionStorage first, then localStorage profile
      const session = sessionStorage.getItem('_usr')
      if (session) return JSON.parse(session)
      const local = localStorage.getItem('_userProfile')
      if (local) return JSON.parse(local)
      return null
    } catch { return null }
  }

  const [user, setUser] = useState(userProp || getCachedUser())

  useEffect(() => {
    if (userProp) {
      setUser(userProp)
      try { sessionStorage.setItem('_usr', JSON.stringify(userProp)) } catch {}
      return
    }
    // Use cached data — no API call needed
    const cached = getCachedUser()
    if (cached) {
      setUser(cached)
      try { sessionStorage.setItem('_usr', JSON.stringify(cached)) } catch {}
    }
  }, [userProp])

  const initials = user?.name?.charAt(0)?.toUpperCase() || '?'

  const handleLogout = () => {
    api.clearTokens()
    try { sessionStorage.removeItem('_usr') } catch {}
    try { localStorage.removeItem('_userProfile') } catch {}
    navigate('/')
  }

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#FFFFFF',
      fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Top Navbar */}
      <nav style={{
        width: '100%', backgroundColor: '#fff',
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          height: '68px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }} className="nav-pad">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src="/logo.jpeg" alt="JaNoNi" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#151A40', lineHeight: 1.2 }}>JaNoNi</div>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#41A465' }}>ಜನೋನಿ</div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="nav-links">
            {navItems.map(item => (
              <button key={item.key} onClick={() => navigate(item.path)} style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '8px 16px', borderRadius: '10px', border: 'none',
                backgroundColor: active === item.key ? '#EEF2FF' : 'transparent',
                color: active === item.key ? '#151A40' : '#6b5e52',
                fontSize: '14px', fontWeight: active === item.key ? '700' : '500',
                cursor: 'pointer',
              }}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>

            {/* Hamburger — mobile only */}
            <button onClick={() => setShowMobileMenu(v => !v)}
              className="mobile-menu-btn"
              style={{ background: 'none', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', display: 'none', alignItems: 'center', justifyContent: 'center' }}>
              {showMobileMenu ? <MdClose size={22} color="#151A40" /> : <MdMenu size={22} color="#151A40" />}
            </button>

            {/* Profile button */}
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 12px', borderRadius: '10px',
                border: '1px solid #E5E7EB', backgroundColor: '#fff',
                cursor: 'pointer',
              }}
            >
              {user?.photo ? (
                <img src={user.photo} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  backgroundColor: '#151A40', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '16px', color: '#fff', fontWeight: '700',
                }}>
                  {initials}
                </div>
              )}
              <MdKeyboardArrowDown size={18} color="#6b5e52" />
            </button>

            {/* Profile Dropdown */}
            {showDropdown && (
              <>
                <div onClick={() => setShowDropdown(false)}
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} />
                <div style={{
                  position: 'absolute', top: '50px', right: 0,
                  backgroundColor: '#fff', borderRadius: '12px',
                  border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  minWidth: '200px', zIndex: 1000,
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>{user?.name || 'User'}</p>
                    <p style={{ fontSize: '12px', color: '#6b5e52', margin: '2px 0 0' }}>+91 {user?.phone || ''}</p>
                  </div>
                  <button onClick={() => { setShowDropdown(false); navigate('/user/profile'); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#1a1a1a', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8F9FA'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <MdEdit size={18} color="#151A40" /> Edit Profile
                  </button>
                  <button onClick={() => { setShowDropdown(false); handleLogout(); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#1a1a1a', textAlign: 'left', borderTop: '1px solid #E5E7EB' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EEF2FF'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <MdLogout size={18} color="#151A40" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {showMobileMenu && (
          <>
            <div onClick={() => setShowMobileMenu(false)}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 98 }} />
            <div style={{
              position: 'absolute', top: '68px', left: 0, right: 0,
              backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)', zIndex: 99,
              padding: '8px 16px 12px',
            }}>
              {navItems.map(item => (
                <button key={item.key} onClick={() => { navigate(item.path); setShowMobileMenu(false) }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '10px', border: 'none',
                    backgroundColor: active === item.key ? '#EEF2FF' : 'transparent',
                    color: active === item.key ? '#151A40' : '#6b5e52',
                    fontSize: '15px', fontWeight: active === item.key ? '700' : '500',
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* Page Content */}
      <main style={{ flex: 1, width: '100%', maxWidth: '1280px', margin: '0 auto' }} className="page-pad">
        {children}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E5E7EB', padding: '16px 32px', backgroundColor: '#FFFFFF', textAlign: 'center' }}>
        <span style={{ fontSize: '12px', color: '#9e8e80' }}>Protected by National Informatics Centre. © {new Date().getFullYear()} IGMS.</span>
      </footer>
    </div>
  )
}
