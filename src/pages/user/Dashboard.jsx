import { useNavigate } from 'react-router-dom'
import { MdAdd, MdOutlineWarningAmber, MdOutlineRefresh } from 'react-icons/md'
import { HiCheckCircle } from 'react-icons/hi2'
import { BsFileEarmarkText } from 'react-icons/bs'
import UserLayout from './UserLayout'

const activities = [
  {
    id: '#GR-8821', time: '2h ago',
    title: 'Status Updated:',
    desc: 'Street light repair assigned to the Electrical Department, North Zone.',
    tag: 'In Progress', tagColor: '#2563eb', tagBg: '#eff6ff',
    icon: <MdOutlineRefresh size={20} color="#2563eb" />, iconBg: '#eff6ff',
  },
  {
    id: '#GR-8790', time: 'Yesterday',
    title: 'Case Resolved:',
    desc: 'Sanitation clearance request has been successfully closed and verified.',
    tag: 'Resolved', tagColor: '#41A465', tagBg: '#edf7f1',
    icon: <HiCheckCircle size={20} color="#41A465" />, iconBg: '#edf7f1',
  },
  {
    id: '#GR-8902', time: '2d ago',
    title: 'Action Required:',
    desc: 'Please upload a clear photo of the damaged pipeline for the inspector.',
    tag: null, tagColor: null, tagBg: null,
    icon: <MdOutlineWarningAmber size={20} color="#2596be" />, iconBg: '#fef0e6',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <UserLayout active="dashboard">
      {/* Welcome + Submit row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.2 }}>
            Welcome back, Kiran.
          </h1>
          <p style={{ fontSize: '16px', color: '#6b5e52', margin: 0 }}>How can we assist your grievance today?</p>
        </div>
        <button
          onClick={() => navigate('/user/submit')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '14px 28px', borderRadius: '14px',
            backgroundColor: '#2596be', color: '#fff', border: 'none',
            fontSize: '16px', fontWeight: '700', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(231,83,0,0.3)',
          }}
        >
          <MdAdd size={22} /> Submit Complaint
        </button>
      </div>

      {/* Stats + Activity grid */}
      <div className="dashboard-grid">

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Stat cards */}
          <div className="stat-cards">
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #ede5d8' }}>
              <p style={{ fontSize: '48px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 4px', lineHeight: 1 }}>03</p>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#6b5e52', letterSpacing: '1px', margin: '0 0 16px' }}>ACTIVE</p>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#fef0e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BsFileEarmarkText size={20} color="#2596be" />
              </div>
            </div>
            <div style={{ backgroundColor: '#f0f0ee', borderRadius: '20px', padding: '24px', border: '1px solid #e0ddd8' }}>
              <p style={{ fontSize: '48px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 4px', lineHeight: 1 }}>12</p>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#6b5e52', letterSpacing: '1px', margin: '0 0 16px' }}>RESOLVED</p>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#edf7f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiCheckCircle size={20} color="#41A465" />
              </div>
            </div>
          </div>

          {/* Did you know */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #ede5d8', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-16px', bottom: '-16px', opacity: 0.06 }}>
              <HiCheckCircle size={120} color="#41A465" />
            </div>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 10px' }}>Did you know?</p>
            <p style={{ fontSize: '14px', color: '#6b5e52', margin: '0 0 16px', lineHeight: 1.7 }}>
              92% of water-related grievances are resolved within 48 hours. Your feedback helps us build a better city.
            </p>
            <button style={{
              padding: '8px 18px', borderRadius: '999px',
              backgroundColor: 'transparent', border: '1.5px solid #e0d5c8',
              color: '#555', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}>
              Learn about our TAT
            </button>
          </div>
        </div>

        {/* Right column — Recent Activity */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #ede5d8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Recent Activity</p>
            <button onClick={() => navigate('/user/complaints')} style={{
              background: 'none', border: 'none', color: '#2596be',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}>
              VIEW ALL →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activities.map((a) => (
              <div key={a.id} style={{
                display: 'flex', gap: '14px', padding: '18px',
                borderRadius: '14px', backgroundColor: '#faf6f0',
                border: '1px solid #ede5d8',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  backgroundColor: a.iconBg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                      {a.title} <span style={{ color: '#2596be' }}>{a.id}</span>
                    </p>
                    <span style={{ fontSize: '12px', color: '#9e8e80', whiteSpace: 'nowrap', marginLeft: '12px' }}>{a.time}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#6b5e52', margin: '0 0 10px', lineHeight: 1.6 }}>{a.desc}</p>
                  {a.tag && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '4px 12px', borderRadius: '999px',
                      backgroundColor: a.tagBg, color: a.tagColor,
                      fontSize: '12px', fontWeight: '600',
                    }}>
                      • {a.tag}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
