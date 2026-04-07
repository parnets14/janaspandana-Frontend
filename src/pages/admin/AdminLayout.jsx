import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MdDashboard, 
  MdPeople, 
  MdAssignment, 
  MdBarChart, 
  MdSettings, 
  MdLogout,
  MdMenu,
  MdClose,
  MdNotifications,
  MdSearch,
  MdPerson,
  MdBusiness,
  MdOutlineEngineering
} from 'react-icons/md'
import { RiGovernmentLine } from 'react-icons/ri'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: MdDashboard, path: '/admin/dashboard' },
  { id: 'users', label: 'User Management', icon: MdPeople, path: '/admin/users' },
  { id: 'complaints', label: 'All Complaints', icon: MdAssignment, path: '/admin/complaints' },
  { id: 'departments', label: 'Departments', icon: MdBusiness, path: '/admin/departments' },
  { id: 'officers', label: 'Officers', icon: MdOutlineEngineering, path: '/admin/officers' },
]

export default function AdminLayout({ children, active }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    navigate('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        style={{
          width: '280px',
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          zIndex: 100,
          boxShadow: '2px 0 10px rgba(0,0,0,0.05)'
        }}
        className="hidden-mobile"
      >
        {/* Logo */}
        <div style={{ 
          padding: '24px 20px', 
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <img src="/logo.jpeg" alt="JanaSpandana" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#1a1a1a' }}>Janoni</h1>
            <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = active === item.id
            
            return (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.path)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: 'none',
                  backgroundColor: isActive ? 'rgba(37, 150, 190, 0.1)' : 'transparent',
                  color: isActive ? '#151A40' : '#666',
                  fontSize: '14px',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderLeft: isActive ? '3px solid #151A40' : '3px solid transparent',
                  textAlign: 'left'
                }}
              >
                <Icon size={20} />
                {item.label}
              </motion.button>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <motion.button
            onClick={handleLogout}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#dc2626',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              borderRadius: '10px',
              transition: 'all 0.2s'
            }}
          >
            <MdLogout size={20} />
            Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 99,
              }}
              className="mobile-only"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              style={{
                width: '280px',
                backgroundColor: '#ffffff',
                color: '#1a1a1a',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100,
                boxShadow: '2px 0 10px rgba(0,0,0,0.05)'
              }}
              className="mobile-only"
            >
              {/* Logo */}
              <div style={{ 
                padding: '24px 20px', 
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="/logo.jpeg" alt="JanaSpandana" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div>
                    <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#1a1a1a' }}>Janoni</h1>
                    <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Admin Portal</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1a1a1a',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                >
                  <MdClose size={24} />
                </button>
              </div>

              {/* Navigation */}
              <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = active === item.id
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path)
                        setSidebarOpen(false)
                      }}
                      style={{
                        width: '100%',
                        padding: '14px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        border: 'none',
                        backgroundColor: isActive ? 'rgba(37, 150, 190, 0.1)' : 'transparent',
                        color: isActive ? '#151A40' : '#666',
                        fontSize: '14px',
                        fontWeight: isActive ? '700' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        borderLeft: isActive ? '3px solid #151A40' : '3px solid transparent',
                        textAlign: 'left'
                      }}
                    >
                      <Icon size={20} />
                      {item.label}
                    </button>
                  )
                })}
              </nav>

              {/* Logout */}
              <div style={{ padding: '20px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#dc2626',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    transition: 'all 0.2s'
                  }}
                >
                  <MdLogout size={20} />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        marginLeft: '280px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
      className="main-content-admin"
      >
        {/* Page Content */}
        <main style={{ flex: 1, padding: '32px' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
          .main-content-admin {
            margin-left: 0 !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-only {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
