import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdSearch, MdAdd } from 'react-icons/md'
import { RiBuilding2Line } from 'react-icons/ri'
import { BsCalendar3 } from 'react-icons/bs'
import UserLayout from './UserLayout'
import { complaintAPI } from '../../utils/secureApi'

const STATUS_CONFIG = {
  'Awaiting Review':           { label: 'Awaiting Review',           color: '#6b7280', bg: '#f3f4f6' },
  'Complaint Registered':      { label: 'Complaint Registered',      color: '#2596be', bg: '#e0f2fe' },
  'Assigned to Field Officer': { label: 'Assigned to Field Officer', color: '#1d4ed8', bg: '#dbeafe' },
  'Inspection Completed':      { label: 'Inspection Completed',      color: '#b45309', bg: '#fef3c7' },
  'Work in Progress':          { label: 'Work in Progress',          color: '#7c3aed', bg: '#ede9fe' },
  'Issue Resolved':            { label: 'Issue Resolved',            color: '#15803d', bg: '#dcfce7' },
  'Rejected':                  { label: 'Rejected',                  color: '#dc2626', bg: '#fee2e2' },
  'Pending':                   { label: 'Awaiting Review',           color: '#6b7280', bg: '#f3f4f6' },
}

const DEFAULT_STATUS = { label: 'Awaiting Review', color: '#6b7280', bg: '#f3f4f6' }

const FILTERS = ['ALL', 'Complaint Registered', 'Assigned to Field Officer', 'Inspection Completed', 'Work in Progress', 'Issue Resolved', 'Rejected']

export default function MyComplaints() {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('ALL')

  useEffect(() => {
    complaintAPI.getMy()
      .then(res => {
        // Only show complaints that have been accepted (not awaiting review)
        const visible = res.data.filter(c => c.status !== 'Awaiting Review' && c.status !== 'Pending')
        setComplaints(visible)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = complaints.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.complaintId || '').toLowerCase().includes(search.toLowerCase())
    const statusLabel = (STATUS_CONFIG[c.status] || DEFAULT_STATUS).label
    const matchFilter = activeFilter === 'ALL' || statusLabel === activeFilter || c.status === activeFilter
    return matchSearch && matchFilter
  })

  return (
    <UserLayout active="complaints">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 8px' }}>My Complaints</h1>
          <p style={{ fontSize: '16px', color: '#6b5e52', margin: 0 }}>Tracking your requests for resolution and progress updates.</p>
        </div>
        <button onClick={() => navigate('/user/submit')} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '12px 24px', borderRadius: '12px',
          backgroundColor: '#2596be', color: '#fff', border: 'none',
          fontSize: '15px', fontWeight: '700', cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(231,83,0,0.3)',
        }}>
          <MdAdd size={20} /> New Complaint
        </button>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 18px', borderRadius: '12px',
          backgroundColor: '#fff', border: '1.5px solid #e0d5c8',
          flex: '1', minWidth: '240px', maxWidth: '360px',
        }}>
          <MdSearch size={18} color="#9e8e80" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID or title..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#1a1a1a', backgroundColor: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: '9px 18px', borderRadius: '999px', border: '1.5px solid',
              borderColor: activeFilter === f ? '#2596be' : '#e0d5c8',
              backgroundColor: activeFilter === f ? '#2596be' : '#fff',
              color: activeFilter === f ? '#fff' : '#555',
              fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b5e52', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #ede5d8' }}>
          No complaints found.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filtered.map(c => {
            const statusCfg = STATUS_CONFIG[c.status] || DEFAULT_STATUS
            return (
              <div key={c._id}
                onClick={() => navigate(`/user/complaint/${c._id}`)}
                style={{
                  backgroundColor: '#fff', borderRadius: '16px',
                  padding: '22px', border: '1px solid #ede5d8',
                  cursor: 'pointer', transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#9e8e80', fontFamily: 'monospace' }}>
                    #{c.complaintId}
                  </span>
                  <span style={{
                    padding: '4px 12px', borderRadius: '999px',
                    backgroundColor: statusCfg.bg, color: statusCfg.color,
                    fontSize: '11px', fontWeight: '700', letterSpacing: '0.3px', whiteSpace: 'nowrap'
                  }}>
                    {statusCfg.label}
                  </span>
                </div>

                <p style={{ fontSize: '17px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 14px', lineHeight: 1.3 }}>
                  {c.title}
                </p>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b5e52' }}>
                    <RiBuilding2Line size={14} color="#9e8e80" /> {c.department}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b5e52' }}>
                    <BsCalendar3 size={13} color="#9e8e80" />
                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </UserLayout>
  )
}
