import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdAdd, MdOutlineRefresh, MdRemoveRedEye } from 'react-icons/md'
import { HiCheckCircle } from 'react-icons/hi2'
import { BsFileEarmarkText } from 'react-icons/bs'
import UserLayout from './UserLayout'
import { complaintAPI } from '../../utils/secureApi'

const STATUS_CONFIG = {
  'Awaiting Review':           { color: '#6b7280', bg: '#f3f4f6' },
  'Complaint Registered':      { color: '#151A40', bg: '#e0f2fe' },
  'Assigned to Field Officer': { color: '#1d4ed8', bg: '#dbeafe' },
  'Inspection Completed':      { color: '#b45309', bg: '#fef3c7' },
  'Work in Progress':          { color: '#7c3aed', bg: '#ede9fe' },
  'Issue Resolved':            { color: '#15803d', bg: '#dcfce7' },
  'Rejected':                  { color: '#dc2626', bg: '#fee2e2' },
}
const DEFAULT_SS = { color: '#6b7280', bg: '#f3f4f6' }

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load name immediately from cache
    const cached = localStorage.getItem('_userProfile')
    if (cached) {
      try { setUser(JSON.parse(cached)) } catch {}
    }

    const fetchData = async () => {
      try {
        const cRes = await complaintAPI.getMy()
        if (cRes.success) setComplaints(cRes.data || [])
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const active = complaints.filter(c => !['Issue Resolved', 'Rejected'].includes(c.status)).length
  const resolved = complaints.filter(c => c.status === 'Issue Resolved').length
  const recent = [...complaints].slice(0, 5)

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <UserLayout active="dashboard">

      {/* Welcome + Submit */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.2 }}>
            Welcome back, {firstName}.
          </h1>
          <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>How can we assist your grievance today?</p>
        </div>
        <button onClick={() => navigate('/user/submit')} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '13px 24px', borderRadius: '12px',
          backgroundColor: '#151A40', color: '#fff', border: 'none',
          fontSize: '15px', fontWeight: '700', cursor: 'pointer',
        }}>
          <MdAdd size={20} /> Submit Complaint
        </button>
      </div>

      <div className="dashboard-grid">

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Stat cards */}
          <div className="stat-cards">
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: '48px', fontWeight: '900', color: '#151A40', margin: '0 0 4px', lineHeight: 1 }}>
                {loading ? '—' : String(active).padStart(2, '0')}
              </p>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', letterSpacing: '1px', margin: '0 0 16px' }}>ACTIVE</p>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BsFileEarmarkText size={20} color="#151A40" />
              </div>
            </div>
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: '48px', fontWeight: '900', color: '#15803d', margin: '0 0 4px', lineHeight: 1 }}>
                {loading ? '—' : String(resolved).padStart(2, '0')}
              </p>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', letterSpacing: '1px', margin: '0 0 16px' }}>RESOLVED</p>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiCheckCircle size={20} color="#15803d" />
              </div>
            </div>
          </div>

          {/* Total */}
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px', fontWeight: '600' }}>Total Complaints</p>
              <p style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a', margin: 0 }}>{loading ? '—' : complaints.length}</p>
            </div>
            <button onClick={() => navigate('/user/complaints')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: '13px', fontWeight: '600', color: '#151A40', cursor: 'pointer' }}>
              <MdRemoveRedEye size={15} /> View All
            </button>
          </div>

          {/* Info card */}
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px' }}>Did you know?</p>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 14px', lineHeight: 1.7 }}>
              92% of water-related grievances are resolved within 48 hours. Your feedback helps us build a better city.
            </p>
            <button style={{ padding: '7px 16px', borderRadius: '999px', backgroundColor: 'transparent', border: '1.5px solid #e5e7eb', color: '#555', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
              Learn about our TAT
            </button>
          </div>
        </div>

        {/* Right column — Recent Activity */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Recent Activity</p>
            <button onClick={() => navigate('/user/complaints')} style={{ background: 'none', border: 'none', color: '#151A40', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              VIEW ALL →
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
          ) : recent.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
              <BsFileEarmarkText size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: '14px' }}>No complaints yet. Submit your first one!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recent.map(c => {
                const ss = STATUS_CONFIG[c.status] || DEFAULT_SS
                const lastHistory = c.statusHistory?.[c.statusHistory.length - 1]
                return (
                  <div key={c._id}
                    onClick={() => navigate(`/user/complaint/${c._id}`)}
                    style={{ display: 'flex', gap: '14px', padding: '16px', borderRadius: '12px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f9fafb'}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: ss.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MdOutlineRefresh size={18} color={ss.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', gap: '8px' }}>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.title}
                        </p>
                        <span style={{ fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap', flexShrink: 0 }}>
                          {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', margin: '0 0 6px', fontFamily: 'monospace' }}>#{c.complaintId} · {c.department}</p>
                      {lastHistory?.note && (
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 6px', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lastHistory.note}</p>
                      )}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '999px', backgroundColor: ss.bg, color: ss.color, fontSize: '11px', fontWeight: '700' }}>
                        • {c.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  )
}
