import { useNavigate } from 'react-router-dom'
import { MdSearch, MdRemoveRedEye, MdOutlineEngineering, MdFilterList } from 'react-icons/md'
import { useState, useEffect } from 'react'
import OfficerLayout from './OfficerLayout'
import api from '../../utils/secureApi'

const filters = ['All Tasks', 'Inspection Completed', 'Work in Progress', 'Issue Resolved', 'Rejected']

const statusColor = (s) => {
  if (s === 'Issue Resolved') return { color: '#15803d', bg: '#dcfce7' }
  if (['Work in Progress', 'Assigned to Field Officer', 'Inspection Completed'].includes(s)) return { color: '#7c3aed', bg: '#ede9fe' }
  if (s === 'Rejected') return { color: '#dc2626', bg: '#fee2e2' }
  return { color: '#151A40', bg: '#e0f2fe' }
}

export default function OfficerDashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All Tasks')
  const [complaints, setComplaints] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 })
  const [officerName, setOfficerName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchComplaints() }, [])

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints/officer')
      if (res.success) {
        setComplaints(res.data)
        setStats(res.stats)
        setOfficerName(res.officerName)
      }
    } catch (err) {
      console.error('Failed to fetch complaints', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = complaints.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.complaintId?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = activeFilter === 'All Tasks' || c.status === activeFilter
    return matchSearch && matchFilter
  })

  return (
    <OfficerLayout active="dashboard">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 6px' }}>Assigned Complaints</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            {officerName ? <>Officer: <strong>{officerName}</strong> — only complaints assigned to you</> : 'Loading...'}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total', value: stats.total, color: '#151A40', border: '#151A40' },
          { label: 'In Progress', value: stats.inProgress, color: '#7c3aed', border: '#8b5cf6' },
          { label: 'Resolved', value: stats.resolved, color: '#15803d', border: '#22c55e' },
          { label: 'Pending', value: stats.pending, color: '#6b7280', border: '#9ca3af' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: `4px solid ${s.border}` }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <MdFilterList size={16} color="#151A40" />
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>Filters</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '5px' }}>STATUS</label>
            <select value={activeFilter} onChange={e => setActiveFilter(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', backgroundColor: '#fff' }}>
              {filters.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '5px' }}>SEARCH</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
              <MdSearch size={16} color="#9ca3af" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by ID or title..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', color: '#1a1a1a', backgroundColor: 'transparent' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
            <MdOutlineEngineering size={40} color="#e0d5c8" style={{ marginBottom: '10px', display: 'block', margin: '0 auto 10px' }} />
            No complaints assigned to you yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {['Complaint ID', 'Title', 'Department', 'City / Ward', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const sc = statusColor(c.status)
                  return (
                    <tr key={c._id}
                      style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#151A40', fontFamily: 'monospace' }}>#{c.complaintId}</span>
                      </td>
                      <td style={{ padding: '14px 16px', maxWidth: '200px' }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#9ca3af' }}>{c.user?.name || 'Citizen'}</p>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151', whiteSpace: 'nowrap' }}>{c.department}</td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                        {[c.location?.city, c.location?.ward].filter(Boolean).join(' · ') || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: '700', backgroundColor: sc.bg, color: sc.color }}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                        {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button onClick={() => navigate(`/officer/case/${c._id}`)}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: '12px', fontWeight: '600', color: '#151A40', cursor: 'pointer' }}>
                          <MdRemoveRedEye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && complaints.length > 0 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f3f4f6', fontSize: '13px', color: '#6b7280', textAlign: 'right' }}>
            {filtered.length} of {complaints.length} complaint{complaints.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

    </OfficerLayout>
  )
}
