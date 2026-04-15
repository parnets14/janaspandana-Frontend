import { useNavigate } from 'react-router-dom'
import { MdDashboard, MdNotifications, MdLogout, MdMessage, MdAssessment } from 'react-icons/md'
import { RiBuildingLine, RiFileList3Line } from 'react-icons/ri'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: <MdDashboard size={20} />, path: '/operator/dashboard' },
  { key: 'complaints', label: 'Complaints', icon: <RiFileList3Line size={20} />, path: '/operator/complaints' },
  { key: 'messages', label: 'Messages', icon: <MdMessage size={20} />, path: '/operator/messages' },
  { key: 'reports', label: 'Reports', icon: <MdAssessment size={20} />, path: '/operator/reports' },
]

export default function OperatorLayout({ children, active }) {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#FFF7EC',
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
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#41A465', lineHeight: 1.2 }}>JaNoNi</div>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#151A40' }}>Operator Portal</div>
            </div>
          </div>

          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {navItems.map(item => (
              <button key={item.key} onClick={() => navigate(item.path)} style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '8px 16px', borderRadius: '10px', border: 'none',
                backgroundColor: active === item.key ? '#edf7f1' : 'transparent',
                color: active === item.key ? '#41A465' : '#6b5e52',
                fontSize: '14px', fontWeight: active === item.key ? '700' : '500', cursor: 'pointer',
              }}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid #e0d5c8', backgroundColor: '#f0e8dc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <MdNotifications size={20} color="#555" />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '10px', backgroundColor: '#edf7f1', border: '1px solid #c8e6d7' }}>
              <RiBuildingLine size={18} color="#41A465" />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#41A465' }}>Operator</span>
            </div>
            <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '1px solid #e0d5c8', backgroundColor: '#fff', color: '#555', fontSize: '13px', cursor: 'pointer' }}>
              <MdLogout size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, width: '100%', maxWidth: '1280px', margin: '0 auto' }} className="page-pad">
        {children}
      </main>

      <footer style={{ borderTop: '1px solid #e0d5c8', padding: '16px 32px', backgroundColor: '#FFF7EC', textAlign: 'center' }}>
        <span style={{ fontSize: '12px', color: '#9e8e80' }}>Protected by National Informatics Centre. © {new Date().getFullYear()} IGMS.</span>
      </footer>
    </div>
  )
}
