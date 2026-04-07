import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdPeople, MdAssignment, MdCheckCircle, MdPending, MdOutlineEngineering, MdRefresh, MdRemoveRedEye } from 'react-icons/md'
import AdminLayout from './AdminLayout'
import api from '../../utils/secureApi'

const STATUS_STYLES = {
  'Awaiting Review':           { color: '#6b7280', bg: '#f3f4f6' },
  'Complaint Registered':      { color: '#151A40', bg: '#e0f2fe' },
  'Assigned to Field Officer': { color: '#1d4ed8', bg: '#dbeafe' },
  'Inspection Completed':      { color: '#b45309', bg: '#fef3c7' },
  'Work in Progress':          { color: '#7c3aed', bg: '#ede9fe' },
  'Issue Resolved':            { color: '#15803d', bg: '#dcfce7' },
  'Rejected':                  { color: '#dc2626', bg: '#fee2e2' },
}
const DEFAULT_SS = { color: '#6b7280', bg: '#f3f4f6' }

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [users, setUsers] = useState([])
  const [officers, setOfficers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [cRes, uRes, oRes] = await Promise.all([
        api.get('/complaints'),
        api.get('/admin/users'),
        api.get('/admin/officers'),
      ])
      if (cRes.success) setComplaints(cRes.data)
      if (uRes.success) setUsers(uRes.data)
      if (oRes.success) setOfficers(oRes.data)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const total = complaints.length
  const pending = complaints.filter(c => ['Awaiting Review', 'Complaint Registered'].includes(c.status)).length
  const inProgress = complaints.filter(c => ['Assigned to Field Officer', 'Inspection Completed', 'Work in Progress'].includes(c.status)).length
  const resolved = complaints.filter(c => c.status === 'Issue Resolved').length
  const recent = [...complaints].slice(0, 5)
  const recentUsers = [...users].slice(0, 5)

  const statCards = [
    { label: 'Total Users', value: users.length, icon: MdPeople, color: '#151A40', border: '#151A40' },
    { label: 'Total Complaints', value: total, icon: MdAssignment, color: '#2563eb', border: '#2563eb' },
    { label: 'Resolved', value: resolved, icon: MdCheckCircle, color: '#15803d', border: '#22c55e' },
    { label: 'Pending', value: pending, icon: MdPending, color: '#b45309', border: '#f59e0b' },
    { label: 'In Progress', value: inProgress, icon: MdAssignment, color: '#7c3aed', border: '#8b5cf6' },
    { label: 'Officers', value: officers.length, icon: MdOutlineEngineering, color: '#0891b2', border: '#06b6d4' },
  ]

  return (
    <AdminLayout active="dashboard">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 6px' }}>Dashboard Overview</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Monitor system-wide metrics and activities</p>
        </div>
        <button onClick={fetchAll} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: '#374151' }}>
          <MdRefresh size={16} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {statCards.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: `4px solid ${s.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>{s.label}</span>
                <Icon size={18} color={s.color} />
              </div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: s.color }}>
                {loading ? '—' : s.value}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>

        {/* Recent Complaints */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #f3f4f6' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Recent Complaints</h2>
            <button onClick={() => navigate('/admin/complaints')} style={{ background: 'none', border: 'none', color: '#151A40', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>View All →</button>
          </div>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
          ) : recent.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No complaints yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  {['ID', 'Title', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(c => {
                  const ss = STATUS_STYLES[c.status] || DEFAULT_SS
                  return (
                    <tr key={c._id} style={{ borderTop: '1px solid #f3f4f6' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#151A40', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>#{c.complaintId}</td>
                      <td style={{ padding: '12px 16px', maxWidth: '160px' }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#9ca3af' }}>{c.department}</p>
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '700', backgroundColor: ss.bg, color: ss.color }}>{c.status}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={() => navigate('/admin/complaints')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#151A40' }}>
                          <MdRemoveRedEye size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* Recent Users */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #f3f4f6' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Recent Users</h2>
            <button onClick={() => navigate('/admin/users')} style={{ background: 'none', border: 'none', color: '#151A40', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>View All →</button>
          </div>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
          ) : recentUsers.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No users yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  {['User', 'Phone', 'Registered', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(u => (
                  <tr key={u._id} style={{ borderTop: '1px solid #f3f4f6' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#151A40', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6b7280' }}>{u.phone}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '700', backgroundColor: u.isActive ? '#dcfce7' : '#fee2e2', color: u.isActive ? '#15803d' : '#dc2626' }}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  )
}
